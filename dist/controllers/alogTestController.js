"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlogTestController = void 0;
const alogTestService_1 = require("../services/alogTestService");
const validationService_1 = require("../services/validationService");
class AlogTestController {
    constructor() {
        this.alogTestService = new alogTestService_1.AlogTestService();
    }
    async getAllRecords(req, res) {
        try {
            const records = await this.alogTestService.getAllRecords();
            res.json({
                success: true,
                data: records.map(record => record.toJSON())
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch records',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async createRecord(req, res) {
        try {
            const { name } = req.body;
            const result = await this.alogTestService.createRecord({ name });
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: result.errors
                });
                return;
            }
            res.status(201).json({
                success: true,
                message: 'Record created successfully',
                data: result.record?.toJSON()
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create record',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async getRecordById(req, res) {
        try {
            const { id } = req.params;
            const validation = validationService_1.ValidationService.validateId(id);
            if (!validation.isValid) {
                res.status(400).json({
                    success: false,
                    message: validation.error
                });
                return;
            }
            const record = await this.alogTestService.getRecordById(id);
            if (!record) {
                res.status(404).json({
                    success: false,
                    message: 'Record not found'
                });
                return;
            }
            res.json({
                success: true,
                data: record.toJSON()
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch record',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async updateRecord(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const idValidation = validationService_1.ValidationService.validateId(id);
            if (!idValidation.isValid) {
                res.status(400).json({
                    success: false,
                    message: idValidation.error
                });
                return;
            }
            const result = await this.alogTestService.updateRecord(id, { name });
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Update failed',
                    errors: result.errors
                });
                return;
            }
            res.json({
                success: true,
                message: 'Record updated successfully',
                data: result.record?.toJSON()
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update record',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async deleteRecord(req, res) {
        try {
            const { id } = req.params;
            const validation = validationService_1.ValidationService.validateId(id);
            if (!validation.isValid) {
                res.status(400).json({
                    success: false,
                    message: validation.error
                });
                return;
            }
            const result = await this.alogTestService.deleteRecord(id);
            if (!result.success) {
                res.status(404).json({
                    success: false,
                    message: 'Delete failed',
                    errors: result.errors
                });
                return;
            }
            res.json({
                success: true,
                message: 'Record deleted successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete record',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.AlogTestController = AlogTestController;
//# sourceMappingURL=alogTestController.js.map