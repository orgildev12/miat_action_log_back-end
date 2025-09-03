import oracledb from 'oracledb';
import { dbManager } from '../database';
import { AlogTestQueries } from './alogTestQueries';

export class AlogTestService {
  async getAllRecords(): Promise<oracledb.Result<any>> {
    return await dbManager.executeQuery(
      AlogTestQueries.getAllRecords, []
    );
  }

  async createRecord(name: string): Promise<oracledb.Result<any>> {
    return await dbManager.executeQuery(
      AlogTestQueries.createRecord, [name]
    );
  }

  async getRecordById(id: string): Promise<oracledb.Result<any>> {
    return await dbManager.executeQuery(
      AlogTestQueries.getRecordById, [id]
    );
  }

  async updateRecord(id: string, name: string): Promise<oracledb.Result<any>> {
    return await dbManager.executeQuery(
      AlogTestQueries.updateRecord, [name, id]
    );
  }

  async deleteRecord(id: string): Promise<oracledb.Result<any>> {
    return await dbManager.executeQuery(
      AlogTestQueries.deleteRecord, [id]
    );
  }
}
