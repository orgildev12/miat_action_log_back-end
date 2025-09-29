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
    if (isUserLoggedIn) {
      result = await dbManager.executeQuery(
        `INSERT INTO ORGIL.HAZARD (USER_ID, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION)
         VALUES (?, ?, ?, ?, ?)`,
        [
          dbData.USER_ID,
          dbData.TYPE_ID,
          dbData.LOCATION_ID,
          dbData.DESCRIPTION,
          dbData.SOLUTION,
        ]
      );
    } else {
      result = await dbManager.executeQuery(
        `INSERT INTO ORGIL.HAZARD (USER_NAME, EMAIL, PHONE_NUMBER, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          dbData.USER_NAME,
          dbData.EMAIL,
          dbData.PHONE_NUMBER,
          dbData.TYPE_ID,
          dbData.LOCATION_ID,
          dbData.DESCRIPTION,
          dbData.SOLUTION,
        ]
      );
    }
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0 ? newHazard : Promise.reject('Failed to create hazard');
  }

  
  async getAll(
    includeReference: boolean, 
    includePrivateHazars: boolean,
    enrichByUserInfo: boolean
  ): Promise<Hazard[]> {
    let result;
    let whereClause = '';
    if (includePrivateHazars !== false) {
      whereClause += ' WHERE ht.IS_PRIVATE = 0';
    }

    let addSelect = '';
    let addJoin = '';
    if (enrichByUserInfo) {
      addSelect += ' COALESCE(u.USER_NAME, h.USER_NAME) AS USER_NAME, COALESCE(u.EMAIL, h.EMAIL) AS EMAIL, COALESCE(u.PHONE_NUMBER, h.PHONE_NUMBER) AS PHONE_NUMBER,';
      addJoin += ' LEFT JOIN USERS u ON h.USER_ID = u.ID';
    } else {
      addSelect += ' h.USER_NAME, h.EMAIL, h.PHONE_NUMBER,';
    }

    if (!includeReference) {
      result = await dbManager.executeQuery(
        `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.USER_ID, ${addSelect} h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED
         FROM ORGIL.HAZARD h
         ${addJoin}
         INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
         ${whereClause}
         ORDER BY h.DATE_CREATED DESC`,
        []
      );
    } else {
      result = await dbManager.executeQuery(
        `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.USER_ID, ${addSelect} h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED,
          ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
          l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
          r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
         FROM ORGIL.HAZARD h
         ${addJoin}
         INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
         INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
         LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
         ${whereClause}
         ORDER BY h.DATE_CREATED DESC`,
        []
      );
    }

    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return rows.map(row => Hazard.fromDatabase(row));
  }


  async getById(
    id: number, 
    includeReference: boolean,
    includePrivateHazars: boolean,
    enrichByUserInfo: boolean
  ): Promise<Hazard> {

    let result;
    let whereClause = 'WHERE h.ID = ?';
    if (!includePrivateHazars) {
      whereClause += ' AND ht.IS_PRIVATE = 0';
    }

    let addSelect = '';
    let addInnerJoin = '';
    if (enrichByUserInfo) {
      addSelect += ' COALESCE(u.USER_NAME, h.USER_NAME) AS USER_NAME, COALESCE(u.EMAIL, h.EMAIL) AS EMAIL, COALESCE(u.PHONE_NUMBER, h.PHONE_NUMBER) AS PHONE_NUMBER,';
      addInnerJoin += ' LEFT JOIN USERS u ON h.USER_ID = u.ID';
    } else {
      addSelect += ' h.USER_NAME, h.EMAIL, h.PHONE_NUMBER,';
    }

    if (!includeReference) {
      result = await dbManager.executeQuery(
        `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.USER_ID, ${addSelect} h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED
         FROM ORGIL.HAZARD h
         INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
         ${whereClause}`,
        [id]
      );
    } else {
      result = await dbManager.executeQuery(
        `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.USER_ID, ${addSelect} h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED,
          ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
          l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
          r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
         FROM ORGIL.HAZARD h
         ${addInnerJoin}
         INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
         INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
         LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
         ${whereClause}`,
        [id]
      );
    }

    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    if (!rows || rows.length === 0) {
      throw new NotFoundError(`Hazard not found`);
    }
    return Hazard.fromDatabase(rows[0]);
  }

async getAllPrivateByAdminId(adminId: number): Promise<Hazard[]> {
  // 5с доош эрхтэй буюу энгийн админуудад зориулсан.
  // Хэрэглэгчийн мэдээллийг агуулахгүй, 
  // зөвхөн тухайн админд хамаарах private hazard-уудыг буцаана.
    const result = await dbManager.executeQuery(
      `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED,  
        ht.IS_PRIVATE, ht.NAME_EN AS TYPE_NAME_EN, ht.NAME_MN AS TYPE_NAME_MN,
        l.NAME_EN AS LOCATION_NAME_EN, l.NAME_MN AS LOCATION_NAME_MN,
        r.IS_RESPONSE_CONFIRMED, r.RESPONSE_BODY, r.DATE_UPDATED
       FROM ORGIL.HAZARD h
       INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
       INNER JOIN ORGIL.LOCATION l ON h.LOCATION_ID = l.ID
       LEFT JOIN ORGIL.RESPONSE r ON h.ID = r.HAZARD_ID
       INNER JOIN ORGIL.TASK_OWNERS towner ON h.ID = towner.HAZARD_ID
       WHERE ht.IS_PRIVATE = 1 AND towner.ADMIN_ID = ?
       ORDER BY h.DATE_CREATED DESC`,
      [adminId]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return rows.map(row => Hazard.fromDatabase(row));
}

// Зөвхөн хэрэглэгч өөрөө үүсгэсэн hazard-уудыг буцаана. Ямар ч шүүлт хийгдэхгүй.
  async getByUserId(userId: number, includeReference: boolean): Promise<Hazard[]> {
    let result;
    if (!includeReference) {
      result = await dbManager.executeQuery(
        `SELECT * FROM ORGIL.HAZARD h WHERE h.USER_ID = ? ORDER BY h.DATE_CREATED DESC`,
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
         WHERE h.USER_ID = ?
         ORDER BY h.DATE_CREATED DESC`,
        [userId]
      );
    }
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return rows.map(row => Hazard.fromDatabase(row));
  }


  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM ORGIL.HAZARD WHERE ID = ?`,
      [id]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }
}