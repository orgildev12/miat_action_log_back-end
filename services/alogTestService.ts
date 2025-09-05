import oracledb from 'oracledb';
import { dbManager } from '../database';
import { AlogTest } from '../models/AlogTest';

export class AlogTestService {
  async getAllRecords(): Promise<AlogTest[]> {
    const result = await dbManager.executeQuery(
      'SELECT id, name FROM alog_test ORDER BY id'
    );
    
    return result.rows ? result.rows.map(row => AlogTest.fromDatabase(row)) : [];
  }

  async createRecord(data: { name: string }): Promise<{ success: boolean; record?: AlogTest; errors?: string[] }> {
    const alogTest = new AlogTest(data);
    const validation = alogTest.validate();
    
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    try {
      const result = await dbManager.executeQuery(
        'INSERT INTO alog_test (name) VALUES (:1)',
        [data.name]
      );
      
      if (result.rowsAffected && result.rowsAffected > 0) {
        return { success: true, record: alogTest };
      }
      
      return { success: false, errors: ['Failed to create record'] };
    } catch (error) {
      return { success: false, errors: [`Database error: ${error}`] };
    }
  }

  async getRecordById(id: string): Promise<AlogTest | null> {
    const result = await dbManager.executeQuery(
      'SELECT id, name FROM alog_test WHERE id = :1',
      [id]
    );
    
    if (result.rows && result.rows.length > 0) {
      return AlogTest.fromDatabase(result.rows[0]);
    }
    
    return null;
  }

  async updateRecord(id: string, data: { name: string }): Promise<{ success: boolean; record?: AlogTest; errors?: string[] }> {
    const existingRecord = await this.getRecordById(id);
    if (!existingRecord) {
      return { success: false, errors: ['Record not found'] };
    }

    existingRecord.updateName(data.name);
    
    const validation = existingRecord.validate();
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    // Use simple Oracle query with bind parameters
    const query = 'UPDATE alog_test SET name = :1 WHERE id = :2';
    
    try {
      const result = await dbManager.executeQuery(query, [data.name, id]);
      
      if (result.rowsAffected && result.rowsAffected > 0) {
        return { success: true, record: existingRecord };
      }
      
      return { success: false, errors: ['Failed to update record'] };
    } catch (error) {
      return { success: false, errors: [`Database error: ${error}`] };
    }
  }

  async deleteRecord(id: string): Promise<{ success: boolean; errors?: string[] }> {
    const existingRecord = await this.getRecordById(id);
    if (!existingRecord) {
      return { success: false, errors: ['Record not found'] };
    }

    // Use simple Oracle query with bind parameter
    const query = 'DELETE FROM alog_test WHERE id = :1';
    
    try {
      const result = await dbManager.executeQuery(query, [id]);
      
      if (result.rowsAffected && result.rowsAffected > 0) {
        return { success: true };
      }
      
      return { success: false, errors: ['Failed to delete record'] };
    } catch (error) {
      return { success: false, errors: [`Database error: ${error}`] };
    }
  }
}
