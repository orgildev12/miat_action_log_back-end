"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGroupController = void 0;
const LocationGroupService_1 = require("../services/LocationGroupService");
class LocationGroupController {
    constructor() {
        this.locationGroupService = new LocationGroupService_1.LocationGroupService();
    }
    async create(req, res) {
        try {
            const requestData = req.body;
            const createdLocationGroup = await this.locationGroupService.create(requestData);
            res.status(201).json({
                success: true,
                data: createdLocationGroup.toJSON()
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
            const id = Number(req.params.id);
            const locationGroup = await this.locationGroupService.getById(id);
            res.json({
                success: true,
                data: locationGroup.toJSON()
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
    async getAll(req, res) {
        try {
            const locationGroups = await this.locationGroupService.getAll();
            res.json({
                success: true,
                data: locationGroups.map(lg => lg.toJSON())
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
            const id = Number(req.params.id);
            const updateData = req.body;
            const updatedLocationGroup = await this.locationGroupService.update(id, updateData);
            res.json({
                success: true,
                data: updatedLocationGroup.toJSON()
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
            const id = Number(req.params.id);
            const isDeleted = await this.locationGroupService.delete(id);
            if (isDeleted) {
                res.json({
                    success: true,
                    message: 'Location group deleted successfully'
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'Location group not found'
                });
            }
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.LocationGroupController = LocationGroupController;
//# sourceMappingURL=LocationGroupController.js.map