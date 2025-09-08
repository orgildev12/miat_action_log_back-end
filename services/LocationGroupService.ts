import { dbManager } from '../database';
import { LocationGroup } from '../models/LocationGroup';

export class LocationGroupService {

    async create(requestData: typeof LocationGroup.modelFor.createRequest): Promise<LocationGroup> {
        const newLocationGroup = LocationGroup.fromRequestData(requestData);
        
        const validation = newLocationGroup.validate();
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        const dbData = newLocationGroup.toDatabaseFormat();

        const result = await dbManager.executeQuery(
            `INSERT INTO LOCATION_GROUP (NAME_EN, NAME_MN)
             VALUES (:1, :2)`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN
            ],
            { autoCommit: true }
        );

        return newLocationGroup;
    }

    async getById(id: number): Promise<LocationGroup> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM LOCATION_GROUP WHERE ID = :1`, 
            [id]
        );
        
        if (result.rows && result.rows.length > 0) {
            return LocationGroup.fromDatabase(result.rows[0]);
        }
        throw new Error(`Location group with ID ${id} not found`);
    }

    async getAll(): Promise<LocationGroup[]> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM LOCATION_GROUP ORDER BY NAME_EN`, 
            []
        );

        if (result.rows) {
            return result.rows.map(row => LocationGroup.fromDatabase(row));
        }
        return [];
    }

    async update(id: number, updateData: typeof LocationGroup.modelFor.updateRequest): Promise<LocationGroup> {
        // Get existing location group
        const existingLocationGroup = await this.getById(id);
        
        // Update with new data
        existingLocationGroup.updateWith(updateData);
        
        // Validate
        const validation = existingLocationGroup.validate();
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        const dbData = existingLocationGroup.toDatabaseFormat();
        
        const result = await dbManager.executeQuery(
            `UPDATE LOCATION_GROUP
             SET NAME_EN = :1, NAME_MN = :2
             WHERE ID = :3`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN,
                id
            ],
            { autoCommit: true }
        );
        
        if ((result.rowsAffected || 0) === 0) {
            throw new Error(`Location group with ID ${id} not found`);
        }
        
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM LOCATION_GROUP WHERE ID = :1`,
            [id],
            { autoCommit: true }
        );
        return (result.rowsAffected || 0) > 0;
    }
}