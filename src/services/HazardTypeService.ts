import { dbManager } from '../../database';
import { HazardType } from '../models/HazardType';
import { ValidationError, NotFoundError } from '../middleware/errorHandler/errorTypes';

export class HazardTypeService {

    async create(requestData: typeof HazardType.modelFor.createRequest): Promise<HazardType> {
        const newHazardType = HazardType.fromRequestData(requestData);
        const validation = newHazardType.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = newHazardType.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `INSERT INTO HAZARD_TYPE (SHORT_CODE, NAME_EN, NAME_MN, IS_PRIVATE)
             VALUES (?, ?, ?, ?)`,
            [
                dbData.SHORT_CODE,
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.IS_PRIVATE
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new Error('Failed to create hazard_type');
        }
        return new HazardType({
            short_code: newHazardType.short_code,
            name_en: newHazardType.name_en,
            name_mn: newHazardType.name_mn,
            isPrivate: newHazardType.isPrivate
        });
    }

    async getById(id: number): Promise<HazardType> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM HAZARD_TYPE WHERE ID = ?`, 
            [id]
        );
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        if (rows.length > 0) {
            return HazardType.fromDatabase(rows[0]);
        }
        throw new NotFoundError(`HazardType with id: ${id} not found`);
    }

    async getAll(): Promise<HazardType[]> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM HAZARD_TYPE ORDER BY NAME_MN`, 
            []
        );
        const rows = result.rows as import('mysql2/promise').RowDataPacket[];
        return rows.map(row => HazardType.fromDatabase(row));
    }

    async update(id: number, updateData: typeof HazardType.modelFor.updateRequest): Promise<HazardType> {
        const existingHazardType = await this.getById(id);
        existingHazardType.updateWith(updateData);

        const validation = existingHazardType.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = existingHazardType.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `UPDATE HAZARD_TYPE
             SET SHORT_CODE = ?, NAME_EN = ?, NAME_MN = ?, IS_PRIVATE = ?
             WHERE ID = ?`,
            [
                dbData.SHORT_CODE,
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.IS_PRIVATE,
                id
            ]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        if (packet.affectedRows === 0) {
            throw new NotFoundError(`HazardType with ID ${id} not found`);
        }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM HAZARD_TYPE WHERE ID = ?`,
            [id]
        );
        const packet = result.rows as import('mysql2/promise').ResultSetHeader;
        return packet.affectedRows > 0;
    }
}