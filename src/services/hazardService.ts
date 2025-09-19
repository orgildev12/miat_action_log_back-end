import is from 'zod/v4/locales/is.cjs';
import { dbManager } from '../../database';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';
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
      ],
      { autoCommit: true }
    );

    return newHazard;
  }


  async getById(
    id: number, 
    includeReference: boolean = true,
    includePrivateHazars: boolean = false
  ): Promise<Hazard> {

    let result;
    let whereClause = 'WHERE h.ID = :1';
    if (!includePrivateHazars) {
      whereClause += ' AND ht.IS_PRIVATE = 0';
    }

    // only super-admin can call '/hazard/includeRef=false'
    if(!includeReference){
      result = await dbManager.executeQuery(
        `SELECT h.*,
        FROM HAZARD h
        ${whereClause}`,
        [id]
      );
    }

    result = await dbManager.executeQuery(
      `SELECT h.*,
        ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
        l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
        r.ISCONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
      FROM HAZARD h
      INNER JOIN HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
      INNER JOIN LOCATION l ON h.LOCATION_ID = l.ID
      LEFT JOIN RESPONSE r ON h.ID = r.HAZARD_ID
      ${whereClause}`,
      [id]
    );

    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`Hazard not found`);
    }
    return Hazard.fromDatabase(result.rows[0]);
  }

  
  async getAll(
    includeReference: boolean = false, 
    includePrivateHazars: boolean = false
  ): Promise<Hazard[]> {
    let result;
    let whereClause = '';
    if (!includePrivateHazars) {
      whereClause += ' WHERE ht.IS_PRIVATE = 0';
    }

    if(!includeReference){
      result = await dbManager.executeQuery(
        `SELECT *
        FROM HAZARD h
        ${whereClause}
        ORDER BY h.DATE_CREATED DESC`,
        []
      );
    }

    result = await dbManager.executeQuery(
      `SELECT h.*, 
        ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
        l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
        r.ISCONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
      FROM HAZARD h
      INNER JOIN HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
      INNER JOIN LOCATION l ON h.LOCATION_ID = l.ID
      LEFT JOIN RESPONSE r ON h.ID = r.HAZARD_ID
      ${whereClause}
      ORDER BY h.DATE_CREATED DESC`,
      []
    );

    if (result.rows) {
      return result.rows.map(row => Hazard.fromDatabase(row));
    }
    return [];
  }


  async getByUserId(userId: number, includeReference: boolean = true): Promise<Hazard[]> {
    let result;
    if (!includeReference) {
      result = await dbManager.executeQuery(
        `SELECT * FROM HAZARD h WHERE h.USER_ID = :1 ORDER BY h.DATE_CREATED DESC`,
        [userId]
      );
    } else {
      result = await dbManager.executeQuery(
        `SELECT h.*, 
          ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
          l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
          r.ISCONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
        FROM HAZARD h
        INNER JOIN HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
        INNER JOIN LOCATION l ON h.LOCATION_ID = l.ID
        LEFT JOIN RESPONSE r ON h.ID = r.HAZARD_ID
        WHERE h.USER_ID = :1
        ORDER BY h.DATE_CREATED DESC`,
        [userId]
      );
    }
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