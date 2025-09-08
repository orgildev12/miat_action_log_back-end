"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlogTest = void 0;
class AlogTest {
    constructor(data = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
    }
    validate() {
        const errors = [];
        if (!this.name || this.name.trim().length === 0) {
            errors.push('Name is required');
        }
        if (this.name && this.name.length > 255) {
            errors.push('Name must be less than 255 characters');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    static fromDatabase(row) {
        return new AlogTest({
            id: row.ID || row.id,
            name: row.NAME || row.name
        });
    }
    toDatabase() {
        return {
            ID: this.id,
            NAME: this.name.trim()
        };
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name
        };
    }
    isNew() {
        return this.id === 0;
    }
    updateName(newName) {
        this.name = newName;
    }
}
exports.AlogTest = AlogTest;
//# sourceMappingURL=AlogTest.js.map