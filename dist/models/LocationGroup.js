"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGroup = void 0;
class LocationGroup {
    constructor(data) {
        this.id = data.id;
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
    }
    validate() {
        const errors = [];
        if (!this.name_en || this.name_en.trim().length === 0) {
            errors.push('English name is required');
        }
        if (!this.name_mn || this.name_mn.trim().length === 0) {
            errors.push('Mongolian name is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    toDatabaseFormat() {
        return {
            ID: this.id,
            NAME_EN: this.name_en,
            NAME_MN: this.name_mn
        };
    }
    toJSON() {
        return {
            id: this.id,
            name_en: this.name_en,
            name_mn: this.name_mn
        };
    }
    static fromDatabase(row) {
        return new LocationGroup({
            id: row.ID,
            name_en: row.NAME_EN,
            name_mn: row.NAME_MN
        });
    }
    static fromRequestData(request) {
        return new LocationGroup({
            name_en: request.name_en,
            name_mn: request.name_mn
        });
    }
    updateWith(updateData) {
        if (updateData.name_en !== undefined)
            this.name_en = updateData.name_en;
        if (updateData.name_mn !== undefined)
            this.name_mn = updateData.name_mn;
    }
}
exports.LocationGroup = LocationGroup;
LocationGroup.modelFor = {
    createRequest: {},
    updateRequest: {},
    fetchData: {}
};
//# sourceMappingURL=LocationGroup.js.map