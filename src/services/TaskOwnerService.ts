import { dbManager } from '../../database';
import { DatabaseUnavailableError, NotFoundError } from '../middleware/errorHandler/errorTypes';
import { TaskOwner } from '../models/TaskOwner';

export class TaskOwnerService {
  
  async getOwnersByHazardId(id: number): Promise<TaskOwner[]> {
    const result = await dbManager.executeQuery(
      `SELECT t.*, a.ROLE_ID, e.EMP_KEY
      FROM TASK_OWNERS t
      INNER JOIN ADMIN a ON t.ADMIN_ID = a.ID
      INNER JOIN EMPLOYEES e ON a.USER_ID = e.EMP_ID
      WHERE HAZARD_ID = :1`,
      [id]
    );
    if (result.rows) {
      return result.rows.map(row => TaskOwner.fromDatabase(row));
    }
    return [];
  };

  async getById(hazard_id: number, admin_id: number): Promise<TaskOwner> {
    const result = await dbManager.executeQuery(
      `SELECT t.*, a.ROLE_ID, e.EMP_KEY
      FROM TASK_OWNERS t
      INNER JOIN ADMIN a ON t.ADMIN_ID = a.ID
      INNER JOIN EMPLOYEES e ON a.USER_ID = e.EMP_ID
      WHERE HAZARD_ID = :1 AND ADMIN_ID = :2`,
      [hazard_id, admin_id]
    );
    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`Task owner with hazard_id: ${hazard_id} and admin_id: ${admin_id} not found`);
    }
    return TaskOwner.fromDatabase(result.rows[0]);
  };

  async getAll(): Promise<TaskOwner[]> {
    const result = await dbManager.executeQuery(
      `SELECT t.*, a.ROLE_ID, e.EMP_KEY
      FROM TASK_OWNERS t
      INNER JOIN ADMIN a ON t.ADMIN_ID = a.ID
      INNER JOIN EMPLOYEES e ON a.USER_ID = e.EMP_ID`
    );
    if (result.rows) {
      return result.rows.map(row => TaskOwner.fromDatabase(row));
    }
    return [];
  };

  async delete(hazardId: number, adminId: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM TASK_OWNERS 
      WHERE HAZARD_ID = :1 AND ADMIN_ID = :2`,
      [hazardId, adminId],
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  };


  async addOwner(requestData: typeof TaskOwner.modelFor.createRequest): Promise<TaskOwner> {
    const newHazard = TaskOwner.fromRequestData(requestData);
    
    const validation = newHazard.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const dbData = newHazard.toDatabaseFormat();
    
    await dbManager.executeQuery(
      `INSERT INTO HAZARD (HAZARD_ID, ADMIN_ID, IS_COLLABORATOR)
       VALUES (:1, :2, :3)`,
      [
        dbData.HAZARD_ID,
        dbData.ADMIN_ID,
        dbData.IS_COLLABORATOR
      ],
      { autoCommit: true }
    );

    return newHazard;
  };

  async updateOwnerType(hazard_id: number, admin_id: number, isSettingToCollab: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET IS_COLLABORATOR = :3 WHERE HAZARD_ID = :1 AND ADMIN_ID = :2`,
      [ 
        hazard_id, 
        admin_id, 
        isSettingToCollab
      ],
      { autoCommit: true }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  };


  async updateOwner(requestData: typeof TaskOwner.modelFor.updateRequest): Promise<TaskOwner>{
    const result = await dbManager.executeQuery(
      `UPDATE TASK_OWNERS SET ADMIN_ID = :2 WHERE HAZARD_ID = :1 RETURNING *`,
      [ 
        requestData.hazard_id,
        requestData.admin_id
      ]
    );
    if (!result.rows || result.rows.length === 0) {
      throw new DatabaseUnavailableError('Failed to update task owner, please try again later');
    }
    return TaskOwner.fromDatabase(result.rows[0]);
  }


  async findOwnerId(hazardId: number): Promise<number | null> {
    const result = await dbManager.executeQuery(
      `SELECT AMDIN_ID FROM TASK_OWNERS 
      WHERE HAZARD_ID = :1 AND IS_COLLABORATOR = 0`,
      [hazardId]
    );
    return (result.rows && result.rows.length > 0) ? result.rows[0].ADMIN_ID : null;
  };

  async checkOwner(hazardId: number, adminId: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `SELECT ADMIN_ID FROM TASK_OWNERS 
       WHERE HAZARD_ID = :1 AND ADMIN_ID = :2`,
      [hazardId, adminId]
    );
    const isOwner = !!(result.rows && result.rows.length > 0);
    return isOwner;
  };
}
