import { dbManager } from '../../database';
import { NotFoundError } from '../middleware/errorHandler/errorTypes';
import { ResponseModel } from '../models/Response';

export class ResponseService {
  
  async getByIdForUser(id: number): Promise<ResponseModel> {
    const result = await dbManager.executeQuery(
      `SELECT HAZARD_ID, IS_STARTED, RESPONSE_BODY, IS_APPROVED, IS_RESPONSE_CONFIRMED, DATE_UPDATED 
      FROM RESPONSE WHERE HAZARD_ID = ?`,
      [id]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    if (!rows || rows.length === 0) {
      throw new NotFoundError(`ResponseModel not found`);
    }
    return ResponseModel.fromDatabase(rows[0]);
  }

  async getById(id: number): Promise<ResponseModel> {
    const result = await dbManager.executeQuery(
      `SELECT * FROM RESPONSE WHERE HAZARD_ID = ?`,
      [id]
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    if (!rows || rows.length === 0) {
      throw new NotFoundError(`ResponseModel not found`);
    }
    return ResponseModel.fromDatabase(rows[0]);
  }

  async getAll(): Promise<ResponseModel[]> {
    const result = await dbManager.executeQuery(
      `SELECT *
       FROM RESPONSE ORDER BY DATE_UPDATED DESC`
    );
    const rows = result.rows as import('mysql2/promise').RowDataPacket[];
    return rows.map(row => ResponseModel.fromDatabase(row));
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `DELETE FROM RESPONSE WHERE HAZARD_ID = ?`,
      [id]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }

// Update methods
  async startAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET IS_STARTED = 1, CURRENT_STATUS = 'Ажиллаж байгаа', DATE_UPDATED = NOW() WHERE HAZARD_ID = ?`,
      [ id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }

  async updateResponseBody(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET RESPONSE_BODY = ?, DATE_UPDATED = NOW() WHERE HAZARD_ID = ?`,
      [ responseBody, id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }

  async approveRequest(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE SET IS_REQUEST_APPROVED = 1, CURRENT_STATUS = 'Шийдэгдсэн', RESPONSE_BODY = ?, DATE_UPDATED = NOW() WHERE HAZARD_ID = ?`,
      [ responseBody, id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }

  async denyRequest(id: number, responseBody: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_REQUEST_APPROVED = 0, CURRENT_STATUS = 'Татгалзсан', RESPONSE_BODY = ?, DATE_UPDATED = NOW() 
      WHERE HAZARD_ID = ?`,
      [ responseBody, id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }

  async finishAnalysis(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_RESPONSE_FINISHED = 1, RESPONSE_FINISHED_DATE = NOW() 
      WHERE HAZARD_ID = ?`,
      [ id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }


  async confirmResponse(id: number): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_RESPONSE_CONFIRMED = 1, CURRENT_STATUS = 'Зөвшөөрсөн', DATE_UPDATED = NOW() 
      WHERE HAZARD_ID = ?`,
      [ id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }

  async denyResponse(id: number, reasonToDeny: string): Promise<boolean> {
    const result = await dbManager.executeQuery(
      `UPDATE RESPONSE 
      SET IS_RESPONSE_FINISHED = 0, IS_RESPONSE_DENIED = 1, CURRENT_STATUS = 'Буцаасан', REASON_TO_DENY = ?, DATE_UPDATED = NOW() 
      WHERE HAZARD_ID = ?`,
      [ reasonToDeny, id ]
    );
    const packet = result.rows as import('mysql2/promise').ResultSetHeader;
    return packet.affectedRows > 0;
  }
}
