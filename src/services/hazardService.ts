import { dbManager } from '../../database';
import { GenericError, NotFoundError } from '../middleware/errorHandler/errorTypes';
import { Hazard } from '../models/Hazard';

export class HazardService {
  
  async create(requestData: typeof Hazard.modelFor.createRequest): Promise<Hazard> {
    const newHazard = Hazard.fromRequestData(requestData);
    
    const validation = newHazard.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const dbData = newHazard.toDatabaseFormat();
    
    const result = await dbManager.executeQuery(
      `INSERT INTO HAZARD (USER_ID, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION, IS_PRIVATE, ISSTARTED, ISAPPROVED, ISCHECKING, ISCONFIRMED)
       VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10)`,
      [
        dbData.USER_ID,
        dbData.TYPE_ID,
        dbData.LOCATION_ID,
        dbData.DESCRIPTION,
        dbData.SOLUTION,
        dbData.IS_PRIVATE,
        dbData.ISSTARTED,
        dbData.ISAPPROVED,
        dbData.ISCHECKING,
        dbData.ISCONFIRMED
      ],
      { autoCommit: true }
    );

    return newHazard;
  }

  async getById(id: number): Promise<Hazard> {
    const result = await dbManager.executeQuery(
      `SELECT * FROM HAZARD WHERE ID = :1`,
      [id]
    );
    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`Hazard not found`);
    }
    return Hazard.fromDatabase(result.rows[0]);
  }

  async getAll(): Promise<Hazard[]> {
    const result = await dbManager.executeQuery(
      `SELECT *
       FROM HAZARD ORDER BY DATE_CREATED DESC`
    );

    if (result.rows) {
      return result.rows.map(row => Hazard.fromDatabase(row));
    }
    return [];
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM HAZARD WHERE ID = :1`,
      [id],
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }

// Update methods for specific status fields
  async startAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE HAZARD SET ISSTARTED = 1, DATE_UPDATED = SYSDATE WHERE ID = :1`,
      [ id ],
      { autoCommit: true }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async approveRequest(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE HAZARD SET ISAPPROVED = 1, DATE_UPDATED = SYSDATE WHERE ID = :1`,
      [ id ],
      { autoCommit: true }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async denyRequest(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE HAZARD SET ISAPPROVED = 0, DATE_UPDATED = SYSDATE WHERE ID = :1`,
      [ id ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async startChecking(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE HAZARD SET ISCHECKING = 1, DATE_UPDATED = SYSDATE WHERE ID = :1`,
      [ id ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async confirmResponse(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE HAZARD SET ISCONFIRMED = 1, DATE_UPDATED = SYSDATE WHERE ID = :1`,
      [ id ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async denyResponse(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE HAZARD SET ISCONFIRMED = 0, DATE_UPDATED = SYSDATE WHERE ID = :1`,
      [ id ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }
}
