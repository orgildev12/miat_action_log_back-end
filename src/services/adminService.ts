import { dbManager } from '../../database';
import { Admin } from '../models/Admin';
import { ValidationError, NotFoundError, DatabaseUnavailableError } from '../middleware/errorHandler/errorTypes';

export class AdminService {
    private static readonly EMPLOYEES_TABLE = process.env.EMPLOYEES_TABLE;
    async create(requestData: typeof Admin.modelFor.createRequest): Promise<Admin> {
        const promptValues = Admin.fromRequestData(requestData);
        const validation = promptValues.validate();
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const dbData = promptValues.toDatabaseFormat();
        const result = await dbManager.executeQuery(
            `INSERT INTO ORGIL.ADMIN (USER_ID, ROLE_ID)
             VALUES (:1, :2)`,
            [
                dbData.USER_ID,
                dbData.ROLE_ID,
            ],
            { autoCommit: true }
        );
        if ((result.rowsAffected || 0) === 0) {
            throw new DatabaseUnavailableError('Failed to add admin, please try again later');
        }
        // INSERT doesn't return rows; return the constructed model or re-fetch
        return new Admin({
            user_id: promptValues.user_id,
            role_id: promptValues.role_id,
        });
    }

    async getById(id: number): Promise<Admin> {
        const result = await dbManager.executeQuery(
            `SELECT a.*, r.ROLE_NAME, e.EMP_KEY AS USER_NAME 
            FROM ORGIL.ADMIN a
            INNER JOIN ORGIL.ADMIN_ROLE r ON a.ROLE_ID = r.ID
            INNER JOIN ${AdminService.EMPLOYEES_TABLE} e ON a.USER_ID = e.EMP_ID
            WHERE a.ID = :1`,
            [id]
        );
        if (result.rows && result.rows.length > 0) {
            return Admin.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`Admin with ${id} not found`);
    }

    async getByUserId(id: number): Promise<Admin> {
        const result = await dbManager.executeQuery(
            `SELECT a.*, r.ROLE_NAME, e.EMP_KEY AS USER_NAME 
            FROM ORGIL.ADMIN a
            INNER JOIN ORGIL.ADMIN_ROLE r ON a.ROLE_ID = r.ID
            INNER JOIN ${AdminService.EMPLOYEES_TABLE} e ON a.USER_ID = e.EMP_ID
            WHERE a.USER_ID = :1`,
            [id]
        );
        if (result.rows && result.rows.length > 0) {
            return Admin.fromDatabase(result.rows[0]);
        }
        throw new NotFoundError(`Admin with user_id: ${id} not found`);
    }

    async getAll(): Promise<Admin[]> {
        const result = await dbManager.executeQuery(
            `SELECT a.*, r.ROLE_NAME, e.EMP_KEY AS USER_NAME
            FROM ORGIL.ADMIN a
            INNER JOIN ORGIL.ADMIN_ROLE r ON a.ROLE_ID = r.ID
            INNER JOIN ${AdminService.EMPLOYEES_TABLE} e ON a.USER_ID = e.EMP_ID`,
            []
        );

        if (result.rows) {
            console.log('Fetched admins:', result.rows);
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
        console.log("paramsId: ", id, " roleId:  ", dbData.ROLE_ID);
        const result = await dbManager.executeQuery(
            `UPDATE ORGIL.ADMIN SET ROLE_ID = :2
             WHERE ID = :1`,
            [
                id,
                dbData.ROLE_ID
            ],
            { autoCommit: true }
        );
        
        // if ((result.rowsAffected || 0) === 0) {
        //     throw new DatabaseUnavailableError(`Failed to update admin role, please try again lateeeer`);
        // }
        return await this.getById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await dbManager.executeQuery(
            `DELETE FROM ORGIL.ADMIN WHERE ID = :1`,
            [id],
            { autoCommit: true }
        );
        return (result.rowsAffected || 0) > 0;
    }

    async checkIsAdmin(userId: number): Promise<number | null> {
        const result = await dbManager.executeQuery(
            `SELECT ID FROM ORGIL.ADMIN WHERE USER_ID = :1`,
            [userId]
        );
        return (result.rows && result.rows.length > 0) ? result.rows[0].ID : null;
    }
}