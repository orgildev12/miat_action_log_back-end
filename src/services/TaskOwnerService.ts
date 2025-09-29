import { dbManager } from '../../database';
import { DatabaseUnavailableError, NotFoundError } from '../middleware/errorHandler/errorTypes';
import { TaskOwner } from '../models/TaskOwner';

export class TaskOwnerService {
  
  async getOwnersByHazardId(id: number): Promise<TaskOwner[]> {
    const result = await dbManager.executeQuery(
      `SELECT t.*, a.ROLE_ID, e.EMP_KEY
      FROM ORGIL.TASK_OWNERS t
      INNER JOIN ORGIL.ADMIN a ON t.ADMIN_ID = a.ID
      INNER JOIN ORGIL.EMPLOYEES e ON a.USER_ID = e.EMP_ID
      WHERE HAZARD_ID = ?`,
      [id]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return rows.map(row => TaskOwner.fromDatabase(row));
  };

  async getById(hazard_id: number, admin_id: number): Promise<TaskOwner> {
    const result = await dbManager.executeQuery(
      `SELECT t.*, a.ROLE_ID, e.EMP_KEY
      FROM ORGIL.TASK_OWNERS t
      INNER JOIN ORGIL.ADMIN a ON t.ADMIN_ID = a.ID
      INNER JOIN ORGIL.EMPLOYEES e ON a.USER_ID = e.EMP_ID
      WHERE HAZARD_ID = ? AND ADMIN_ID = ?`,
      [hazard_id, admin_id]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    if (!rows || rows.length === 0) {
      throw new NotFoundError(`Task owner with hazard_id: ${hazard_id} and admin_id: ${admin_id} not found`);
    }
    return TaskOwner.fromDatabase(rows[0]);
  };

  async getAll(): Promise<TaskOwner[]> {
    const result = await dbManager.executeQuery(
      `SELECT t.*, a.ROLE_ID, e.EMP_KEY
      FROM ORGIL.TASK_OWNERS t
      INNER JOIN ORGIL.ADMIN a ON t.ADMIN_ID = a.ID
      INNER JOIN ORGIL.EMPLOYEES e ON a.USER_ID = e.EMP_ID`
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return rows.map(row => TaskOwner.fromDatabase(row));
  };

  async delete(hazardId: number, adminId: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM ORGIL.TASK_OWNERS 
      WHERE HAZARD_ID = ? AND ADMIN_ID = ?`,
      [hazardId, adminId]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  };


  async addOwner(requestData: typeof TaskOwner.modelFor.createRequest): Promise<TaskOwner> {
    const newHazard = TaskOwner.fromRequestData(requestData);
    
    const validation = newHazard.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const dbData = newHazard.toDatabaseFormat();
    
    await dbManager.executeQuery(
      `INSERT INTO ORGIL.TASK_OWNERS (HAZARD_ID, ADMIN_ID, IS_COLLABORATOR)
       VALUES (?, ?, ?)`,
      [
        dbData.HAZARD_ID,
        dbData.ADMIN_ID,
        dbData.IS_COLLABORATOR
      ]
    );
    return newHazard;
  };

  async updateOwnerType(hazard_id: number, admin_id: number, isSettingToCollab: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.TASK_OWNERS SET IS_COLLABORATOR = ? WHERE HAZARD_ID = ? AND ADMIN_ID = ?`,
      [ 
        isSettingToCollab,
        hazard_id, 
        admin_id
      ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  };


  async updateOwner(requestData: typeof TaskOwner.modelFor.updateRequest): Promise<TaskOwner>{
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.TASK_OWNERS SET ADMIN_ID = ? WHERE HAZARD_ID = ?`,
      [ 
        requestData.admin_id,
        requestData.hazard_id
      ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    if (packet.affectedRows === 0) {
      throw new DatabaseUnavailableError('Failed to update task owner, please try again later');
    }
    return await this.getById(requestData.hazard_id!, requestData.admin_id!);
  }


  async findOwnerId(hazardId: number): Promise<number | null> {
    const result = await dbManager.executeQuery(
      `SELECT ADMIN_ID FROM ORGIL.TASK_OWNERS 
      WHERE HAZARD_ID = ? AND IS_COLLABORATOR = 0`,
      [hazardId]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return (rows && rows.length > 0) ? rows[0].ADMIN_ID : null;
  };

  async checkOwner(hazardId: number, adminId: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `SELECT ADMIN_ID FROM ORGIL.TASK_OWNERS 
       WHERE HAZARD_ID = ? AND ADMIN_ID = ?`,
      [hazardId, adminId]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return !!(rows && rows.length > 0);
  };
}
