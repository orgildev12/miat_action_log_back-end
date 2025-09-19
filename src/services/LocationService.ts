import { dbManager } from '../../database';
import { Location } from '../models/Location';
import { ValidationError, NotFoundError } from '../middleware/errorHandler/errorTypes';

export class LocationService {

    async create(requestData: typeof Location.modelFor.createRequest): Promise<Location> {
        const newLocation = Location.fromRequestData(requestData);
        const validation = newLocation.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = newLocation.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `INSERT INTO LOCATION (NAME_EN, NAME_MN, LOCATION_GROUP_ID)
             VALUES (:1, :2, :3)`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.LOCATION_GROUP_ID
            ],
            { autoCommit: true }
        );
        if ((result.rowsAffected || 0) === 0) {
            throw new Error('Failed to create location');
        }
        // INSERT doesn't return rows; return the constructed model or re-fetch
        return new Location({
            id: undefined,
            name_en: newLocation.name_en,
            name_mn: newLocation.name_mn,
            location_group_id: newLocation.location_group_id
        });
    }

    async getById(id: number, includeReference: boolean = true): Promise<Location> {
        let result;
        if (!includeReference) {
            result = await dbManager.executeQuery(
                `SELECT * FROM LOCATION WHERE ID = :1`,
                [id]
            );
        } else {
            result = await dbManager.executeQuery(
                `SELECT l.*, lg.NAME_EN AS GROUP_NAME_EN, lg.NAME_MN AS GROUP_NAME_MN
                FROM LOCATION l
                LEFT OUTER JOIN LOCATION_GROUP lg ON l.LOCATION_GROUP_ID = lg.ID
                WHERE l.ID = :1`,
                [id]
            );
        }
        if (result.rows && result.rows.length > 0) {
            return Location.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`Location with id: ${id} not found`);
    }

    
    async getAll(includeReference: boolean = true): Promise<Location[]> {
        let result;
        if (!includeReference) {
            result = await dbManager.executeQuery(
                `SELECT * FROM LOCATION ORDER BY NAME_EN`,
                []
            );
        } else {
            result = await dbManager.executeQuery(
                `SELECT l.*, lg.NAME_EN AS GROUP_NAME_EN, lg.NAME_MN AS GROUP_NAME_MN
                 FROM LOCATION l
                 LEFT OUTER JOIN LOCATION_GROUP lg ON l.LOCATION_GROUP_ID = lg.ID
                 ORDER BY l.NAME_EN`,
                []
            );
        }
        if (result.rows) {
            return result.rows.map(row => Location.fromDatabase(row));
        }
        return [];
    }

    async update(id: number, updateData: typeof Location.modelFor.updateRequest): Promise<Location> {
        const existingLocation = await this.getById(id);
        existingLocation.updateWith(updateData);

        const validation = existingLocation.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = existingLocation.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `UPDATE LOCATION
             SET NAME_EN = :1, NAME_MN = :2, LOCATION_GROUP_ID = :3
             WHERE ID = :4`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.LOCATION_GROUP_ID,
                id
            ],
            { autoCommit: true }
        );
        
        if ((result.rowsAffected || 0) === 0) {
            throw new NotFoundError(`Location with ID ${id} not found`);
        }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM LOCATION WHERE ID = :1`,
            [id],
            { autoCommit: true }
        );
        return (result.rowsAffected || 0) > 0;
    }
}