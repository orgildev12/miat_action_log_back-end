import { dbManager } from '../../database';
import { LocationGroup } from '../models/LocationGroup';
import { ValidationError, NotFoundError } from '../middleware/errorHandler/errorTypes';

export class LocationGroupService {

    async create(requestData: typeof LocationGroup.modelFor.createRequest): Promise<LocationGroup> {
        const newLocationGroup = LocationGroup.fromRequestData(requestData);
        const validation = newLocationGroup.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = newLocationGroup.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `INSERT INTO ORGIL.LOCATION_GROUP (NAME_EN, NAME_MN)
             VALUES (?, ?)`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new Error('Failed to create location group');
        }
        return newLocationGroup;
    }

    async getById(id: number): Promise<LocationGroup> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ORGIL.LOCATION_GROUP WHERE ID = ?`, 
            [id]
        );
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        if (rows.length > 0) {
            return LocationGroup.fromDatabase(rows[0]);
        }
        throw new NotFoundError(`Location group with id: ${id} not found`);
    }

    async getAll(): Promise<LocationGroup[]> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ORGIL.LOCATION_GROUP ORDER BY NAME_EN`, 
            []
        );
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        return rows.map(row => LocationGroup.fromDatabase(row));
    }

    async update(id: number, updateData: typeof LocationGroup.modelFor.updateRequest): Promise<LocationGroup> {
        const existingLocationGroup = await this.getById(id);
        existingLocationGroup.updateWith(updateData);

        const validation = existingLocationGroup.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = existingLocationGroup.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `UPDATE ORGIL.LOCATION_GROUP
             SET NAME_EN = ?, NAME_MN = ?
             WHERE ID = ?`,
            [
                dbData.NAME_EN,
                dbData.NAME_MN,
                id
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new NotFoundError(`Location group with ID ${id} not found`);
        }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM ORGIL.LOCATION_GROUP WHERE ID = ?`,
            [id]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        return packet.affectedRows > 0;
    }
}