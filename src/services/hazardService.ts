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
      `INSERT INTO HAZARD (USER_ID, USER_NAME, EMAIL, PHONE_NUMBER, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION, IS_PRIVATE)
       VALUES (:1, :2, :3, :4, :5, :6, :7, :8, :9)`,
      [
        dbData.USER_ID,
        dbData.USER_NAME,
        dbData.EMAIL,
        dbData.PHONE_NUMBER,
        dbData.TYPE_ID,
        dbData.LOCATION_ID,
        dbData.DESCRIPTION,
        dbData.SOLUTION,
        dbData.IS_PRIVATE || 0,
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
}
