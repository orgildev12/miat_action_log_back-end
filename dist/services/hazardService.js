"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardService = void 0;
const database_1 = require("../database");
const Hazard_1 = require("../models/Hazard");
class HazardService {
    async create(requestData) {
        const newHazard = Hazard_1.Hazard.fromRequestData(requestData);
        const validation = newHazard.validate();
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        const dbData = newHazard.toDatabaseFormat();
        const result = await database_1.dbManager.executeQuery(`INSERT INTO HAZARD (USER_ID, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION, IS_PRIVATE, STATUS_ID)
       VALUES (:1, :2, :3, :4, :5, :6, :7)`, [
            dbData.USER_ID,
            dbData.TYPE_ID,
            dbData.LOCATION_ID,
            dbData.DESCRIPTION,
            dbData.SOLUTION,
            dbData.IS_PRIVATE,
            dbData.STATUS_ID
        ], { autoCommit: true });
        return newHazard;
    }
    async getById(id) {
        const result = await database_1.dbManager.executeQuery(`SELECT * FROM HAZARD WHERE ID = :1`, [id]);
        if (result.rows && result.rows.length > 0) {
            return Hazard_1.Hazard.fromDatabase(result.rows[0]);
        }
        throw new Error(`Hazard with ID ${id} not found`);
    }
    async getAll() {
        const result = await database_1.dbManager.executeQuery(`SELECT ID, CODE, USER_ID, TYPE_ID, LOCATION_ID, DESCRIPTION, SOLUTION, 
              IS_PRIVATE, STATUS_ID, DATE_CREATED, DATE_UPDATED
       FROM HAZARD ORDER BY DATE_CREATED DESC`);
        if (result.rows) {
            return result.rows.map(row => Hazard_1.Hazard.fromDatabase(row));
        }
        return [];
    }
    async update(id, updateData) {
        const existingHazard = await this.getById(id);
        existingHazard.updateWith(updateData);
        const validation = existingHazard.validate();
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
        const dbData = existingHazard.toDatabaseFormat();
        const result = await database_1.dbManager.executeQuery(`UPDATE HAZARD 
       SET USER_ID = :1, TYPE_ID = :2, LOCATION_ID = :3, DESCRIPTION = :4, 
           SOLUTION = :5, IS_PRIVATE = :6, STATUS_ID = :7, DATE_UPDATED = SYSDATE
       WHERE ID = :8`, [
            dbData.USER_ID,
            dbData.TYPE_ID,
            dbData.LOCATION_ID,
            dbData.DESCRIPTION,
            dbData.SOLUTION,
            dbData.IS_PRIVATE,
            dbData.STATUS_ID,
            id
        ], { autoCommit: true });
        if ((result.rowsAffected || 0) === 0) {
            throw new Error(`Hazard with ID ${id} not found`);
        }
        return await this.getById(id);
    }
    async delete(id) {
        const result = await database_1.dbManager.executeQuery(`DELETE FROM HAZARD WHERE ID = :1`, [id], { autoCommit: true });
        return (result.rowsAffected || 0) > 0;
    }
}
exports.HazardService = HazardService;
//# sourceMappingURL=hazardService.js.map