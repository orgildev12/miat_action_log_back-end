import { dbManager } from '../../database';
import { AdminRole } from '../models/AdminRole';
import { ValidationError, NotFoundError, DatabaseUnavailableError } from '../middleware/errorHandler/errorTypes';

export class AdminService {

    async create(requestData: typeof AdminRole.modelFor.createRequest): Promise<AdminRole> {
        const promptValues = AdminRole.fromRequestData(requestData);
        const validation = promptValues.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = promptValues.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `INSERT INTO ADMINROLE (ROLE_NAME)
             VALUES (:1)`,
            [
                dbData.ROLE_NAME,
            ],
            { autoCommit: true }
        );
        if ((result.rowsAffected || 0) === 0) {
            throw new DatabaseUnavailableError('Failed to add admin, please try again later');
        }
        // INSERT doesn't return rows; return the constructed model or re-fetch
        return new AdminRole({
            role_name: promptValues.role_name,
        });
    }

    async getById(id: number): Promise<AdminRole> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ADMINROLE WHERE ID = :1`,
            [id]
        );
        if (result.rows && result.rows.length > 0) {
            return AdminRole.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`AdminRole with ${id} not found`);
    }

    async getAll(): Promise<AdminRole[]> {
        const result = await dbManager.executeQuery(
            `SELECT * FROM ADMINROLE WHERE ID = :1`,
            []
        );

        if (result.rows) {
            return result.rows.map(row => AdminRole.fromDatabase(row));
        }
        return [];
    }

    async updateRole(id: number, updateData: typeof AdminRole.modelFor.updateRequest): Promise<AdminRole> {
        const existingAdmin = await this.getById(id);
        existingAdmin.updateWith(updateData);

        const validation = existingAdmin.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = existingAdmin.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `UPDATE ADMINROLE SET ROLE_ID = :2,
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
            `DELETE FROM ADMINROLE WHERE ID = :1`,
            [id],
            { autoCommit: true }
        );
        return (result.rowsAffected || 0) > 0;
    }
}