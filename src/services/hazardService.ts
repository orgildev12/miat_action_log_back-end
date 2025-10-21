import is from 'zod/v4/locales/is.cjs';
import { dbManager } from '../../database';
import { NotFoundError, ValidationError } from '../middleware/errorHandler/errorTypes';
import { Hazard } from '../models/Hazard';
import oracledb from 'oracledb';

export class HazardService {
  
async create(
  requestData: typeof Hazard.modelFor.createRequest,
  isUserLoggedIn: boolean
): Promise<Hazard> {
  const newHazard = Hazard.fromRequestData(requestData);

  const validation = newHazard.validate();
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  const dbData = newHazard.toDatabaseFormat();
  let result;
  let generatedId: number;

  // Replace 'ID' with the actual PK column name in your table
  const pkColumn = 'ID';

  if (isUserLoggedIn) {
    result = await dbManager.executeQuery(
      `INSERT INTO ORGIL.HAZARD (USER_ID, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION)
       VALUES (:1, :2, :3, :4, :5)
       RETURNING ${pkColumn} INTO :6`,
      [
        dbData.USER_ID,
        dbData.TYPE_ID,
        dbData.LOCATION_ID,
        dbData.DESCRIPTION,
        dbData.SOLUTION,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ],
      { autoCommit: true }
    );

    generatedId = result.outBinds[0][0];
  } else {
    result = await dbManager.executeQuery(
      `INSERT INTO ORGIL.HAZARD (USER_NAME, EMAIL, PHONE_NUMBER, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION)
       VALUES (:1, :2, :3, :4, :5, :6, :7)
       RETURNING ${pkColumn} INTO :8`,
      [
        dbData.USER_NAME,
        dbData.EMAIL,
        dbData.PHONE_NUMBER,
        dbData.TYPE_ID,
        dbData.LOCATION_ID,
        dbData.DESCRIPTION,
        dbData.SOLUTION,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      ],
      { autoCommit: true }
    );

    generatedId = result.outBinds[0][0];
  }

  if (!generatedId) {
    throw new Error('Failed to create hazard');
  }

  newHazard.id = generatedId;
  return newHazard;
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

    // хэрэглэгчийн мэдээлэл special-admin, super-admin нарт харагдах ёстой. 
    // hazard анх үүсэхэд user_id байсан тохиолдод user_name, email зэрэг нь хадгалагддаггүй,
    // харин гадны хэрэглэгч hazard үүсгэсэн бол user_id байхгүй, нөгөө 3 нь байдаг
    // доорх хэсэгт eoffice-ын дата базаас хэрэглэгчийн мэдээллийг татаж байна.
    let addSelect = '';
      let addJoin = '';
      if (enrichByUserInfo) {
        addSelect += ' COALESCE(CAST(e.EMP_KEY AS NVARCHAR2(320)), CAST(h.USER_NAME AS NVARCHAR2(320))) AS USER_NAME, COALESCE(CAST(e.EMP_EMAIL AS NVARCHAR2(320)), CAST(h.EMAIL AS NVARCHAR2(320))) AS EMAIL, COALESCE(CAST(e.PHONE_MOBILE AS NVARCHAR2(20)), CAST(h.PHONE_NUMBER AS NVARCHAR2(20))) AS PHONE_NUMBER,';
        addJoin += 'LEFT JOIN EOFFICE.EO_EMPLOYEES e ON h.USER_ID = e.EMP_ID';
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

    if (result.rows) {
      return result.rows.map(row => Hazard.fromDatabase(row));
    }
    return [];
  }


  async getById(
    id: number, 
    includeReference: boolean,
    includePrivateHazars: boolean,
    enrichByUserInfo: boolean
  ): Promise<Hazard> {

    let result;
    let whereClause = 'WHERE h.ID = :1';
    if (!includePrivateHazars) {
      whereClause += ' AND ht.IS_PRIVATE = 0';
    }

    let addSelect = '';
    let addInnerJoin = '';
    if (enrichByUserInfo) {
  addSelect += ' COALESCE(CAST(e.EMP_KEY AS NVARCHAR2(320)), CAST(h.USER_NAME AS NVARCHAR2(320))) AS USER_NAME, COALESCE(CAST(e.EMP_EMAIL AS NVARCHAR2(320)), CAST(h.EMAIL AS NVARCHAR2(320))) AS EMAIL, COALESCE(CAST(e.PHONE_MOBILE AS NVARCHAR2(20)), CAST(h.PHONE_NUMBER AS NVARCHAR2(20))) AS PHONE_NUMBER,';
      addInnerJoin += ' INNER JOIN EOFFICE.EO_EMPLOYEES e ON h.USER_ID = e.EMP_ID';
    }else{
      addSelect += ' h.USER_NAME, h.EMAIL, h.PHONE_NUMBER,';
    }

    if(!includeReference){
      result = await dbManager.executeQuery(
        `SELECT h.ID, h.CODE, h.STATUS_EN, h.STATUS_MN, h.USER_ID, ${addSelect} h.TYPE_ID, h.LOCATION_ID, h.DESCRIPTION, h.SOLUTION, h.DATE_CREATED
        FROM ORGIL.HAZARD h
        INNER JOIN ORGIL.HAZARD_TYPE ht ON h.TYPE_ID = ht.ID
        ${whereClause}`,
        [id]
      );
    }else{
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


    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`Hazard not found`);
    }
    return Hazard.fromDatabase(result.rows[0]);
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
      WHERE ht.IS_PRIVATE = 1 AND towner.ADMIN_ID = :1
      ORDER BY h.DATE_CREATED DESC`,
      [adminId]
    );

    if (result.rows) {
      return result.rows.map(row => Hazard.fromDatabase(row));
    }
    return [];
}

// Зөвхөн хэрэглэгч өөрөө үүсгэсэн hazard-уудыг буцаана. Ямар ч шүүлт хийгдэхгүй.
  async getByUserId(userId: number, includeReference: boolean): Promise<Hazard[]> {
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

 async uploadImages(hazardId: number, files: Express.Multer.File[]): Promise<number> {
        const countResult = await dbManager.executeQuery(
            `SELECT COUNT(*) AS CNT FROM ORGIL.HAZARD_IMAGE WHERE HAZARD_ID = :1`,
            [hazardId],
            // { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const currentCount = countResult.rows?.[0]?.CNT || 0;
        if (currentCount + files.length > 3) {
            throw new ValidationError('A hazard cannot have more than 3 images');
        }

        for (const file of files) {
            await dbManager.executeQuery(
                `INSERT INTO ORGIL.HAZARD_IMAGE (HAZARD_ID, IMAGE_DATA)
                 VALUES (:1, :2)`,
                [hazardId, file.buffer],
                { autoCommit: true }
            );
        }

        return files.length;
    }
}