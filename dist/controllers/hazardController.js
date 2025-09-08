"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardController = void 0;
const hazardService_1 = require("../services/hazardService");
class HazardController {
    constructor() {
        this.hazardService = new hazardService_1.HazardService();
    }
    async create(req, res) {
        try {
            const requestData = req.body;
            const createdHazard = await this.hazardService.create(requestData);
            res.status(201).json({
                success: true,
                data: createdHazard.toJSON()
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const hazard = await this.hazardService.getById(id);
            res.json({
                success: true,
                data: hazard.toJSON()
            });
        }
        catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }
    async getAll(req, res) {
        try {
            const hazards = await this.hazardService.getAll();
            res.json({
                success: true,
                data: hazards.map(h => h.toJSON())
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updateData = req.body;
            const updatedHazard = await this.hazardService.update(id, updateData);
            res.json({
                success: true,
                data: updatedHazard.toJSON()
            });
        }
        catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await this.hazardService.delete(id);
            if (deleted) {
                res.json({
                    success: true,
                    message: 'Hazard deleted'
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'Hazard not found'
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.HazardController = HazardController;
//# sourceMappingURL=hazardController.js.map