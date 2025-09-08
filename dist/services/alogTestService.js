"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlogTestService = void 0;
const database_1 = require("../database");
const AlogTest_1 = require("../models/AlogTest");
class AlogTestService {
    async getAllRecords() {
        const result = await database_1.dbManager.executeQuery('SELECT id, name FROM alog_test ORDER BY id');
        return result.rows ? result.rows.map(row => AlogTest_1.AlogTest.fromDatabase(row)) : [];
    }
    async createRecord(data) {
        const alogTest = new AlogTest_1.AlogTest(data);
        const validation = alogTest.validate();
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }
        try {
            const result = await database_1.dbManager.executeQuery('INSERT INTO alog_test (name) VALUES (:1)', [data.name]);
            if (result.rowsAffected && result.rowsAffected > 0) {
                return { success: true, record: alogTest };
            }
            return { success: false, errors: ['Failed to create record'] };
        }
        catch (error) {
            return { success: false, errors: [`Database error: ${error}`] };
        }
    }
    async getRecordById(id) {
        const result = await database_1.dbManager.executeQuery('SELECT id, name FROM alog_test WHERE id = :1', [id]);
        if (result.rows && result.rows.length > 0) {
            return AlogTest_1.AlogTest.fromDatabase(result.rows[0]);
        }
        return null;
    }
    async updateRecord(id, data) {
        const existingRecord = await this.getRecordById(id);
        if (!existingRecord) {
            return { success: false, errors: ['Record not found'] };
        }
        existingRecord.updateName(data.name);
        const validation = existingRecord.validate();
        if (!validation.isValid) {
            return { success: false, errors: validation.errors };
        }
        const query = 'UPDATE alog_test SET name = :1 WHERE id = :2';
        try {
            const result = await database_1.dbManager.executeQuery(query, [data.name, id]);
            if (result.rowsAffected && result.rowsAffected > 0) {
                return { success: true, record: existingRecord };
            }
            return { success: false, errors: ['Failed to update record'] };
        }
        catch (error) {
            return { success: false, errors: [`Database error: ${error}`] };
        }
    }
    async deleteRecord(id) {
        const existingRecord = await this.getRecordById(id);
        if (!existingRecord) {
            return { success: false, errors: ['Record not found'] };
        }
        const query = 'DELETE FROM alog_test WHERE id = :1';
        try {
            const result = await database_1.dbManager.executeQuery(query, [id]);
            if (result.rowsAffected && result.rowsAffected > 0) {
                return { success: true };
            }
            return { success: false, errors: ['Failed to delete record'] };
        }
        catch (error) {
            return { success: false, errors: [`Database error: ${error}`] };
        }
    }
}
exports.AlogTestService = AlogTestService;
//# sourceMappingURL=alogTestService.js.map