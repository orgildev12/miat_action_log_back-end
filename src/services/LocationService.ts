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
             VALUES (?, ?, ?)`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.LOCATION_GROUP_ID
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new Error('Failed to create location');
        }
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
                `SELECT * FROM LOCATION WHERE ID = ?`,
                [id]
            );
        } else {
            result = await dbManager.executeQuery(
                `SELECT l.*, lg.NAME_EN AS GROUP_NAME_EN, lg.NAME_MN AS GROUP_NAME_MN
                FROM LOCATION l
                LEFT OUTER JOIN LOCATION_GROUP lg ON l.LOCATION_GROUP_ID = lg.ID
                WHERE l.ID = ?`,
                [id]
            );
        }
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        if (rows.length > 0) {
            return Location.fromDatabase(rows[0]);
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
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        return rows.map(row => Location.fromDatabase(row));
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
             SET NAME_EN = ?, NAME_MN = ?, LOCATION_GROUP_ID = ?
             WHERE ID = ?`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.LOCATION_GROUP_ID,
                id
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new NotFoundError(`Location with ID ${id} not found`);
        }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM LOCATION WHERE ID = ?`,
            [id]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        return packet.affectedRows > 0;
    }
}