import { dbManager } from '../../database';
import { Admin } from '../models/Admin';
import { ValidationError, NotFoundError, DatabaseUnavailableError } from '../middleware/errorHandler/errorTypes';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class AdminService {
  async create(requestData: typeof Admin.modelFor.createRequest): Promise<Admin> {
    const promptValues = Admin.fromRequestData(requestData);
    const validation = promptValues.validate();
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    const dbData = promptValues.toDatabaseFormat();

    // INSERT query for MySQL
    const result = await dbManager.executeQuery(
      `INSERT INTO ORGIL.ADMIN (USER_ID, ROLE_ID) VALUES (?, ?)`,
      [dbData.USER_ID, dbData.ROLE_ID]
    );

    const packet = result.rows as ResultSetHeader;
    if (packet.affectedRows === 0) {
      throw new DatabaseUnavailableError('Failed to add admin, please try again later');
    }

    return new Admin({
      user_id: promptValues.user_id,
      role_id: promptValues.role_id,
    });
  }

  async getById(id: number): Promise<Admin> {
    const result = await dbManager.executeQuery(
      `SELECT a.*, r.ROLE_NAME, u.USER_NAME
       FROM ORGIL.ADMIN a
       INNER JOIN ORGIL.ADMIN_ROLE r ON a.ROLE_ID = r.ID
       INNER JOIN USERS u ON a.USER_ID = u.ID
       WHERE a.ID = ?`,
      [id]
    );

    const rows = result.rows as RowDataPacket[];
    if (rows.length > 0) {
      return Admin.fromDatabase(rows[0]);
    }
    throw new NotFoundError(`Admin with ${id} not found`);
  }

  async getByUserId(id: number): Promise<Admin> {
    const result = await dbManager.executeQuery(
      `SELECT a.*, r.ROLE_NAME, u.USER_NAME 
       FROM ORGIL.ADMIN a
       INNER JOIN ORGIL.ADMIN_ROLE r ON a.ROLE_ID = r.ID
       INNER JOIN USERS u ON a.USER_ID = u.ID
       WHERE a.USER_ID = ?`,
      [id]
    );

    const rows = result.rows as RowDataPacket[];
    if (rows.length > 0) {
      return Admin.fromDatabase(rows[0]);
    }
    throw new NotFoundError(`Admin with user_id: ${id} not found`);
  }

  async getAll(): Promise<Admin[]> {
    const result = await dbManager.executeQuery(
      `SELECT a.*, r.ROLE_NAME, u.USER_NAME
       FROM ORGIL.ADMIN a
       INNER JOIN ORGIL.ADMIN_ROLE r ON a.ROLE_ID = r.ID
       INNER JOIN USERS u ON a.USER_ID = u.ID`,
      []
    );

    const rows = result.rows as RowDataPacket[];
    return rows.map(row => Admin.fromDatabase(row));
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
      `UPDATE ORGIL.ADMIN SET ROLE_ID = ? WHERE ID = ?`,
      [dbData.ROLE_ID, id]
    );

    const packet = result.rows as ResultSetHeader;
    if (packet.affectedRows === 0) {
      throw new DatabaseUnavailableError(`Failed to update admin role, please try again later`);
    }

    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM ORGIL.ADMIN WHERE ID = ?`,
      [id]
    );

    const packet = result.rows as ResultSetHeader;
    return packet.affectedRows > 0;
  }

  async checkIsAdmin(userId: number): Promise<number | null> {
    const result = await dbManager.executeQuery(
      `SELECT ID FROM ORGIL.ADMIN WHERE USER_ID = ?`,
      [userId]
    );

    const rows = result.rows as RowDataPacket[];
    return rows.length > 0 ? rows[0].ID : null;
  }
}
