import oracledb from 'oracledb';
import { dbManager } from '../database';

export class AlogTestService {
  async getAllRecords(limit: number, offset: number): Promise<oracledb.Result<any>> {
    const sql = `
      SELECT id, name FROM (
        SELECT a.*, ROW_NUMBER() OVER (ORDER BY id) as rn
        FROM alog_test a
      ) 
      WHERE rn > :offset AND rn <= :limit + :offset
    `;

    return await dbManager.executeQuery(sql, [offset, limit, offset]);
  }

  async createRecord(name: string): Promise<oracledb.Result<any>> {
    const sql = `INSERT INTO alog_test (name) VALUES (:name)`;
    return await dbManager.executeQuery(sql, [name]);
  }

  async getRecordById(id: string): Promise<oracledb.Result<any>> {
    const sql = 'SELECT * FROM alog_test WHERE id = :id';
    return await dbManager.executeQuery(sql, [id]);
  }

  async updateRecord(id: string, name: string): Promise<oracledb.Result<any>> {
    const sql = 'UPDATE alog_test SET name = :name WHERE id = :id';
    return await dbManager.executeQuery(sql, [name, id]);
  }

  async deleteRecord(id: string): Promise<oracledb.Result<any>> {
    const sql = 'DELETE FROM alog_test WHERE id = :id';
    return await dbManager.executeQuery(sql, [id]);
  }
}
