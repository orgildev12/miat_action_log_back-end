import { dbManager } from '../../database';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';
import { ResponseModel } from '../models/Response';
import oracledb from 'oracledb';
export class ResponseService {
  
  async getByIdForUser(id: number): Promise<ResponseModel> {
    const result = await dbManager.executeQuery(
      `SELECT HAZARD_ID, IS_STARTED, RESPONSE_BODY, IS_APPROVED, IS_RESPONSE_CONFIRMED, DATE_UPDATED 
      FROM ORGIL.RESPONSE WHERE HAZARED_ID = :1`,
      [id]
    );
    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`ResponseModel not found`);
    }
    return ResponseModel.fromDatabase(result.rows[0]);
  }

  async getById(id: number): Promise<ResponseModel> {
    const result = await dbManager.executeQuery(
      `SELECT * FROM ORGIL.RESPONSE WHERE HAZARD_ID = :1`,
      [id]
    );
    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`ResponseModel not found`);
    }
    return ResponseModel.fromDatabase(result.rows[0]);
  }

  async getAll(): Promise<ResponseModel[]> {
    const result = await dbManager.executeQuery(
      `SELECT *
       FROM ORGIL.RESPONSE ORDER BY DATE_UPDATED DESC`
    );

    if (result.rows) {
      return result.rows.map(row => ResponseModel.fromDatabase(row));
    }
    return [];
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM ORGIL.RESPONSE WHERE HAZARD_ID = :1`,
      [id],
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }

// Update methods
  async startAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.RESPONSE SET IS_STARTED = 1, IS_RESPONSE_CONFIRMED = 0, DATE_UPDATED = SYSDATE WHERE HAZARD_ID = :1`,
      [ id ],
      { autoCommit: true }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async updateResponseBody(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.RESPONSE 
      SET RESPONSE_BODY = :responseBody,
          DATE_UPDATED = SYSDATE
      WHERE HAZARD_ID = :hazardId`,
      {
        hazardId: { val: id, type: oracledb.NUMBER },
        responseBody: { val: responseBody ?? null, type: oracledb.CLOB }
      },
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }


  async approveRequest(id: number, responseBody: string): Promise<boolean> {
    console.log('in service')
    console.log(typeof id, id);
    console.log(typeof responseBody, responseBody);
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.RESPONSE
      SET IS_REQUEST_APPROVED = 1,
          CURRENT_STATUS = 'Шийдэгдсэн',
          RESPONSE_BODY = :responseBody,
          DATE_UPDATED = SYSDATE
      WHERE HAZARD_ID = :hazardId`,
      {
        hazardId: { val: id, type: oracledb.NUMBER },
        responseBody: { val: responseBody ?? null, type: oracledb.CLOB }
      },
      { autoCommit: true, outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async denyRequest(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.RESPONSE 
      SET IS_REQUEST_APPROVED = 0,
          CURRENT_STATUS = 'Татгалзсан',
          RESPONSE_BODY = :responseBody,
          DATE_UPDATED = SYSDATE
      WHERE HAZARD_ID = :hazardId`,
      {
        hazardId: { val: id, type: oracledb.NUMBER },
        responseBody: { val: responseBody ?? null, type: oracledb.CLOB }
      },
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }


  async finishAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.RESPONSE 
      SET IS_RESPONSE_FINISHED = 1, RESPONSE_FINISHED_DATE = SYSDATE 
      WHERE HAZARD_ID = :1`,
      [ id ]
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }


  async confirmResponse(id: number, isRequestApproved: number | null): Promise<boolean> {
      const newStatus = isRequestApproved === 0 ? 'Татгалзсан' : 'Шийдэгдсэн';

      const result = await dbManager.executeQuery(
          `UPDATE ORGIL.RESPONSE 
          SET IS_RESPONSE_CONFIRMED = 1, CURRENT_STATUS = :currentStatus, DATE_UPDATED = SYSDATE 
          WHERE HAZARD_ID = :hazardId`,
          {
              hazardId: { val: id, type: oracledb.NUMBER },
              currentStatus: { val: newStatus, type: oracledb.STRING, maxSize: 200 }
          },
          { autoCommit: true }
      );

      return (result.rowsAffected || 0) > 0;
  }


  async denyResponse(id: number, reasonToDeny: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE ORGIL.RESPONSE 
      SET IS_RESPONSE_FINISHED = 0,
          IS_RESPONSE_DENIED = 1,
          CURRENT_STATUS = 'Буцаасан',
          REASON_TO_DENY = :reason,
          DATE_UPDATED = SYSDATE
      WHERE HAZARD_ID = :hazardId`,
      {
        hazardId: { val: id, type: oracledb.NUMBER },
        reason: { val: reasonToDeny ?? null, type: oracledb.STRING }
      },
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }

}
