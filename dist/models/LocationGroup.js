"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGroup = void 0;
const zod_1 = require("zod");
const LocationGroupSchema = zod_1.z.object({
    id: zod_1.z.int().positive().optional(),
    name_en: zod_1.z.string()
        .min(1, 'English name is required')
        .max(50, 'English name must be 50 characters or less')
        .trim(),
    name_mn: zod_1.z.string()
        .min(1, 'Mongolian name is required')
        .max(50, 'Mongolian name must be 50 characters or less')
        .trim()
});
class LocationGroup {
    constructor(data) {
        this.id = data.id;
        this.name_en = data.name_en;
        this.name_mn = data.name_mn;
    }
    validate() {
        const result = LocationGroupSchema.safeParse(this);
        if (result.success) {
            return { isValid: true, errors: [] };
        }
        const errorMessages = result.error.issues.map(issue => issue.message);
        return { isValid: false, errors: errorMessages };
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