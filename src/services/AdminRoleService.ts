import { dbManager } from '../../database';
import { AdminRole } from '../models/AdminRole';
import { ValidationError, NotFoundError, DatabaseUnavailableError } from '../middleware/errorHandler/errorTypes';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export class AdminRoleService {
  async create(requestData: typeof AdminRole.modelFor.createRequest): Promise<AdminRole> {
    const promptValues = AdminRole.fromRequestData(requestData);
    const validation = promptValues.validate();
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    const dbData = promptValues.toDatabaseFormat();
    const result = await dbManager.executeQuery(
      `INSERT INTO ADMIN_ROLE (ROLE_NAME) VALUES (?)`,
      [dbData.ROLE_NAME]
    );

    const packet = result.rows as ResultSetHeader;
    if (packet.affectedRows === 0) {
      throw new DatabaseUnavailableError('Failed to add admin role, please try again later');
    }

    return new AdminRole({
      role_name: promptValues.role_name,
    });
  }

  async getById(id: number): Promise<AdminRole> {
    const result = await dbManager.executeQuery(
      `SELECT * FROM ADMIN_ROLE WHERE ID = ?`,
      [id]
    );

    const rows = result.rows as RowDataPacket[];
    if (rows.length > 0) {
      return AdminRole.fromDatabase(rows[0]);
    }
    throw new NotFoundError(`AdminRole with ${id} not found`);
  }

  async getAll(): Promise<AdminRole[]> {
    const result = await dbManager.executeQuery(
      `SELECT * FROM ADMIN_ROLE`,
      []
    );

    const rows = result.rows as RowDataPacket[];
    return rows.map(row => AdminRole.fromDatabase(row));
  }

  async updateRole(id: number, updateData: typeof AdminRole.modelFor.updateRequest): Promise<AdminRole> {
    const existingRole = await this.getById(id);
    existingRole.updateWith(updateData);

    const validation = existingRole.validate();
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }

    const dbData = existingRole.toDatabaseFormat();
    const result = await dbManager.executeQuery(
      `UPDATE ADMIN_ROLE SET ROLE_NAME = ? WHERE ID = ?`,
      [dbData.ROLE_NAME, id]
    );

    const packet = result.rows as ResultSetHeader;
    if (packet.affectedRows === 0) {
      throw new DatabaseUnavailableError(`Failed to update admin role, please try again later`);
    }

    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM ADMIN_ROLE WHERE ID = ?`,
      [id]
    );

    const packet = result.rows as ResultSetHeader;
    return packet.affectedRows > 0;
  }
}
