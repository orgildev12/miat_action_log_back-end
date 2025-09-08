"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hazard = void 0;
class Hazard {
    constructor(data) {
        this.id = data.id;
        this.code = data.code;
        this.user_id = data.user_id;
        this.type_id = data.type_id;
        this.location_id = data.location_id;
        this.description = data.description;
        this.solution = data.solution;
        this.is_private = data.is_private || 0;
        this.status_id = data.status_id;
        this.date_created = data.date_created;
        this.date_updated = data.date_updated;
    }
    validate() {
        const errors = [];
        if (!this.user_id || this.user_id <= 0) {
            errors.push('User ID is required');
        }
        if (!this.type_id || this.type_id <= 0) {
            errors.push('Type ID is required');
        }
        if (!this.location_id || this.location_id <= 0) {
            errors.push('Location ID is required');
        }
        if (!this.description || this.description.trim().length === 0) {
            errors.push('Description is required');
        }
        if (!this.status_id || this.status_id <= 0) {
            errors.push('Status ID is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    toDatabaseFormat() {
        return {
            ID: this.id,
            CODE: this.code,
            USER_ID: this.user_id,
            TYPE_ID: this.type_id,
            LOCATION_ID: this.location_id,
            DESCRIPTION: this.description,
            SOLUTION: this.solution || null,
            IS_PRIVATE: this.is_private,
            STATUS_ID: this.status_id,
            DATE_CREATED: this.date_created,
            DATE_UPDATED: this.date_updated
        };
    }
    toJSON() {
        return {
            id: this.id,
            code: this.code,
            user_id: this.user_id,
            type_id: this.type_id,
            location_id: this.location_id,
            description: this.description,
            solution: this.solution,
            is_private: this.is_private,
            status_id: this.status_id,
            date_created: this.date_created,
            date_updated: this.date_updated
        };
    }
    static fromDatabase(row) {
        return new Hazard({
            id: row.ID,
            code: row.CODE,
            user_id: row.USER_ID,
            type_id: row.TYPE_ID,
            location_id: row.LOCATION_ID,
            description: row.DESCRIPTION,
            solution: row.SOLUTION,
            is_private: row.IS_PRIVATE || 0,
            status_id: row.STATUS_ID,
            date_created: row.DATE_CREATED,
            date_updated: row.DATE_UPDATED
        });
    }
    static fromRequestData(request) {
        return new Hazard({
            user_id: request.user_id,
            type_id: request.type_id,
            location_id: request.location_id,
            description: request.description,
            solution: request.solution,
            is_private: request.is_private || 0,
            status_id: request.status_id
        });
    }
    updateWith(updateData) {
        if (updateData.user_id !== undefined)
            this.user_id = updateData.user_id;
        if (updateData.type_id !== undefined)
            this.type_id = updateData.type_id;
        if (updateData.location_id !== undefined)
            this.location_id = updateData.location_id;
        if (updateData.description !== undefined)
            this.description = updateData.description;
        if (updateData.solution !== undefined)
            this.solution = updateData.solution;
        if (updateData.is_private !== undefined)
            this.is_private = updateData.is_private;
        if (updateData.status_id !== undefined)
            this.status_id = updateData.status_id;
    }
}
exports.Hazard = Hazard;
Hazard.modelFor = {
    createRequest: {},
    updateRequest: {},
    fetchData: {}
};
//# sourceMappingURL=Hazard.js.map