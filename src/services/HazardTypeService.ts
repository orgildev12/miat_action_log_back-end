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
            `INSERT INTO ORGIL.HAZARD_TYPE (SHORT_CODE, NAME_EN, NAME_MN, IS_PRIVATE)
             VALUES (:1, :2, :3, :4)`,
            [
                dbData.SHORT_CODE,
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.IS_PRIVATE
            ],
            { autoCommit: true }
        );
        if ((result.rowsAffected || 0) === 0) {
            throw new Error('Failed to create hazard_type');
        }
        // INSERT doesn't return rows; return the constructed model or re-fetch
        return new HazardType({
            short_code: newHazardType.short_code,
            name_en: newHazardType.name_en,
            name_mn: newHazardType.name_mn,
            isPrivate: newHazardType.isPrivate
        });
    }

    async getById(id: number): Promise<HazardType> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ORGIL.HAZARD_TYPE WHERE ID = :1`, 
            [id]
        );
        if (result.rows && result.rows.length > 0) {
            return HazardType.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`HazardType with id: ${id} not found`);
    }

    async getAll(): Promise<HazardType[]> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ORGIL.HAZARD_TYPE ORDER BY NAME_MN`, 
            []
        );

        if (result.rows) {
            return result.rows.map(row => HazardType.fromDatabase(row));
        }
        return [];
    }

    async update(id: number, updateData: typeof HazardType.modelFor.updateRequest): Promise<HazardType> {
        const existingHazardType = await this.getById(id);
        existingHazardType.updateWith(updateData);

        console.log('Update Data:', updateData);
        console.log('Existing HazardType before update:', existingHazardType);

        const validation = existingHazardType.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = existingHazardType.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `UPDATE ORGIL.HAZARD_TYPE
             SET SHORT_CODE = :1, NAME_EN = :2, NAME_MN = :3, IS_PRIVATE = :4
             WHERE ID = :4`,
            [
                dbData.SHORT_CODE,
                dbData.NAME_EN,
                dbData.NAME_MN,
                dbData.IS_PRIVATE,
                id
            ],
            { autoCommit: true }
        );
        
        if ((result.rowsAffected || 0) === 0) {
            throw new NotFoundError(`HazardType with ID ${id} not found`);
        }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM ORGIL.HAZARD_TYPE WHERE ID = :1`,
            [id],
            { autoCommit: true }
        );
        return (result.rowsAffected || 0) > 0;
    }
}