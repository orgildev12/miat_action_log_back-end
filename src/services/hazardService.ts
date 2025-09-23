import is from 'zod/v4/locales/is.cjs';
import { dbManager } from '../../database';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';
import { Hazard } from '../models/Hazard';

export class HazardService {
  
  async create(requestData: typeof Hazard.modelFor.createRequest, isUserLoggedIn: boolean): Promise<Hazard> {
    const newHazard = Hazard.fromRequestData(requestData);
    
    const validation = newHazard.validate();
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const dbData = newHazard.toDatabaseFormat();
    let result;
    if(isUserLoggedIn){
      result = await dbManager.executeQuery(
        `INSERT INTO ORGIL.HAZARD (USER_ID, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION)
        VALUES (:1, :2, :3, :4, :5)`,
        [
          dbData.USER_ID,
          dbData.TYPE_ID,
          dbData.LOCATION_ID,
          dbData.DESCRIPTION,
          dbData.SOLUTION,
        ],
        { autoCommit: true }
      );
    }else{
      result = await dbManager.executeQuery(
        `INSERT INTO ORGIL.HAZARD (USER_NAME, EMAIL, PHONE_NUMBER, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION)
        VALUES (:1, :2, :3, :4, :5, :6, :7)`,
        [
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
    }
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

    if(!includeReference){
      result = await dbManager.executeQuery(
        `SELECT h.*
        FROM ORGIL.HAZARD h
        ${whereClause}`,
        [id]
      );
    }

    result = await dbManager.executeQuery(
      `SELECT h.*,
        ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
        l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
        r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
      FROM ORGIL.HAZARD h
      INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
      INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
      LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
      ${whereClause}`,
      [id]
    );

    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`Hazard not found`);
    }
    return Hazard.fromDatabase(result.rows[0]);
  }

  
  async getAll(
    includeReference: boolean = true, 
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
        FROM ORGIL.HAZARD h
        ${whereClause}
        ORDER BY h.DATE_CREATED DESC`,
        []
      );
    }

    result = await dbManager.executeQuery(
      `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED, 
        ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
        l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
        r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
      FROM ORGIL.HAZARD h
      INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
      INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
      LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
      ${whereClause}
      ORDER BY h.DATE_CREATED DESC`,
      []
    );

    if (result.rows) {
      return result.rows.map(row => Hazard.fromDatabase(row));
    }
    return [];
  }

async getAllPrivateByAdminId(adminId: number): Promise<Hazard[]> {
  // doesn't include user's info
    const result = await dbManager.executeQuery(
      `SELECT h.*, 
        ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
        l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
        r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
      FROM ORGIL.HAZARD h
      INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
      INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
      LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
      INNER JOIN ORGIL.TASK_OWNERS towner ON h.ID = towner.HAZARD_ID
      WHERE ht.IS_PRIVATE = 1 AND towner.ADMIN_ID = :1
      ORDER BY h.DATE_CREATED DESC`,
      [adminId]
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
        `SELECT * FROM ORGIL.HAZARD h WHERE h.USER_ID = :1 ORDER BY h.DATE_CREATED DESC`,
        [userId]
      );
    } else {
      result = await dbManager.executeQuery(
        `SELECT h.*, 
          ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
          l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
          r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
        FROM ORGIL.HAZARD h
        INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
        INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
        LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
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
      `DELETE FROM ORGIL.HAZARD WHERE ID = :1`,
      [id],
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }
}