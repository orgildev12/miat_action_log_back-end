"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGroupService = void 0;
const database_1 = require("../database");
const LocationGroup_1 = require("../models/LocationGroup");
const errors_1 = require("../middleware/errors");
class LocationGroupService {
    async create(requestData) {
        const newLocationGroup = LocationGroup_1.LocationGroup.fromRequestData(requestData);
        const validation = newLocationGroup.validate();
        if (!validation.isValid) {
            throw new errors_1.ValidationError(validation.errors);
        }
        const dbData = newLocationGroup.toDatabaseFormat();
        try {
            const result = await database_1.dbManager.executeQuery(`INSERT INTO LOCATION_GROUP (NAME_EN, NAME_MN)
                 VALUES (:1, :2)`, [
                dbData.NAME_EN,
                dbData.NAME_MN
            ], { autoCommit: true });
            return newLocationGroup;
        }
        catch (error) {
            throw new errors_1.DatabaseError('create location group', error);
        }
    }
    async getById(id) {
        try {
            const result = await database_1.dbManager.executeQuery(`SELECT * FROM LOCATION_GROUP WHERE ID = :1`, [id]);
            if (result.rows && result.rows.length > 0) {
                return LocationGroup_1.LocationGroup.fromDatabase(result.rows[0]);
            }
            throw new errors_1.NotFoundError(`Location group with id: ${id} not found`);
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            throw new errors_1.DatabaseError('fetch location group', error);
        }
    }
    async getAll() {
        const result = await database_1.dbManager.executeQuery(`SELECT * FROM LOCATION_GROUP ORDER BY NAME_EN`, []);
        if (result.rows) {
            return result.rows.map(row => LocationGroup_1.LocationGroup.fromDatabase(row));
        }
        return [];
    }
    async update(id, updateData) {
        const existingLocationGroup = await this.getById(id);
        existingLocationGroup.updateWith(updateData);
        const validation = existingLocationGroup.validate();
        if (!validation.isValid) {
            throw new errors_1.ValidationError(validation.errors);
        }
        const dbData = existingLocationGroup.toDatabaseFormat();
        const result = await database_1.dbManager.executeQuery(`UPDATE LOCATION_GROUP
             SET NAME_EN = :1, NAME_MN = :2
             WHERE ID = :3`, [
            dbData.NAME_EN,
            dbData.NAME_MN,
            id
        ], { autoCommit: true });
        if ((result.rowsAffected || 0) === 0) {
            throw new Error(`Location group with ID ${id} not found`);
        }
        return await this.getById(id);
    }
    async delete(id) {
        const result = await database_1.dbManager.executeQuery(`DELETE FROM LOCATION_GROUP WHERE ID = :1`, [id], { autoCommit: true });
        return (result.rowsAffected || 0) > 0;
    }
}
exports.LocationGroupService = LocationGroupService;
//# sourceMappingURL=LocationGroupService.js.map