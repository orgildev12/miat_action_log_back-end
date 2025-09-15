import { dbManager } from '../../database';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';
import { ResponseModel } from '../models/Response';

export class ResponseService {
  
  async getByIdByUser(id: number): Promise<ResponseModel> {
    const result = await dbManager.executeQuery(
      `SELECT HAZARD_ID, IS_STARTED, RESPONSE_BODY, IS_APPROVED, IS_CONFIRMED, DATE_UPDATED 
      FROM RESPONSE WHERE ID = :1`,
      [id]
    );
    if (!result.rows || result.rows.length === 0) {
      throw new NotFoundError(`ResponseModel not found`);
    }
    return ResponseModel.fromDatabase(result.rows[0]);
  }

  async getById(id: number): Promise<ResponseModel> {
    const result = await dbManager.executeQuery(
      `SELECT * FROM RESPONSE WHERE HAZARD_ID = :1`,
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
       FROM RESPONSE ORDER BY DATE_UPDATED DESC`
    );

    if (result.rows) {
      return result.rows.map(row => ResponseModel.fromDatabase(row));
    }
    return [];
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM RESPONSE WHERE HAZARD_ID = :1`,
      [id],
      { autoCommit: true }
    );

    return (result.rowsAffected || 0) > 0;
  }

// Update methods
  async startAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET IS_STARTED = 1, CURRENT_STATUS = 'Ажиллаж байгаа', DATE_UPDATED = SYSDATE WHERE HAZARD_ID = :1`,
      [ id ],
      { autoCommit: true }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async approveRequest(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET IS_REQUEST_APPROVED = 1, CURRENT_STATUS = 'Шийдэгдсэн', RESPONSE_BODY = :2, DATE_UPDATED = SYSDATE WHERE HAZARD_ID = :1`,
      [ id, responseBody ],
      { autoCommit: true }
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async denyRequest(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_REQUEST_APPROVED = 0, CURRENT_STATUS = 'Татгалзсан', RESPONSE_BODY = :2, DATE_UPDATED = SYSDATE 
      WHERE HAZARD_ID = :1`,
      [ id, responseBody ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async finishAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_RESPONSE_FINISHED = 1, RESPONSE_FINISHED_DATE = SYSDATE 
      WHERE HAZARD_ID = :1`,
      [ id ]
    );
    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async startChecking(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET IS_CHECKING_RESPONSE = 1, CURRENT_STATUS = 'Шалгаж байгаа', DATE_UPDATED = SYSDATE WHERE HAZARD_ID = :1`,
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
      `UPDATE RESPONSE 
      SET IS_RESPONSE_CONFIRMED = 1, CURRENT_STATUS = 'Зөвшөөрсөн', DATE_UPDATED = SYSDATE 
      WHERE HAZARD_ID = :1`,
      [ id ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }

  async denyResponse(id: number, reasonToDeny: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_RESPONSE_FINISHED = 0, IS_RESPONSE_DENIED = 1, CURRENT_STATUS = 'Буцаасан', REASON_TO_DENY = :2, DATE_UPDATED = SYSDATE 
      WHERE HAZARD_ID = :1`,
      [ id, reasonToDeny ],
      { autoCommit: true }
    );

    if ((result.rowsAffected || 0) === 0) {
      return false;
    }
    return true;
  }
}
