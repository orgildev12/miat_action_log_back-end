import { dbManager } from '../../database';
import { Admin } from '../models/Admin';
import { ValidationError, NotFoundError, DatabaseUnavailableError } from '../middleware/errorHandler/errorTypes';

export class AdminService {

    async create(requestData: typeof Admin.modelFor.createRequest): Promise<Admin> {
        const promptValues = Admin.fromRequestData(requestData);
        const validation = promptValues.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = promptValues.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `INSERT INTO ADMIN (USER_ID, ROLE_NAME)
             VALUES (:1, :2)`,
            [
                dbData.USER_ID,
                dbData.ROLE_NAME,
            ],
            { autoCommit: true }
        );
        if ((result.rowsAffected || 0) === 0) {
            throw new DatabaseUnavailableError('Failed to add admin, please try again later');
        }
        // INSERT doesn't return rows; return the constructed model or re-fetch
        return new Admin({
            name_en: promptValues.user_id,
            name_mn: promptValues.role_name,
        });
    }

    async getById(id: number): Promise<Admin> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ADMIN WHERE ID = :1`, 
            [id]
        );
        if (result.rows && result.rows.length > 0) {
            return Admin.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`Admin with not found`);
    }

    async getAll(): Promise<Admin[]> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ADMIN ORDER BY ROLE_NAME`, 
            []
        );

        if (result.rows) {
            return result.rows.map(row => Admin.fromDatabase(row));
        }
        return [];
    }

    async updateRole(id: number, updateData: typeof Admin.modelFor.updateRequest): Promise<Admin> {
        const existingAdmin = await this.getById(id);
        existingAdmin.updateWith(updateData);

        const validation = existingAdmin.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = existingAdmin.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `UPDATE ADMIN
             SET ROLE_NAME = :2,
             WHERE ID = :1`,
            [
                id,
                dbData.ROLE_NAME,
            ],
            { autoCommit: true }
        );
        
        if ((result.rowsAffected || 0) === 0) {
            throw new DatabaseUnavailableError(`Failed to update admin role, please try again later`);
        }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM ADMIN WHERE ID = :1`,
            [id],
            { autoCommit: true }
        );
        return (result.rowsAffected || 0) > 0;
    }
}