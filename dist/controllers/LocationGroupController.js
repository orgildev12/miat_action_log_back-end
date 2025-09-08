"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationGroupController = void 0;
const LocationGroupService_1 = require("../services/LocationGroupService");
const errors_1 = require("../middleware/errors");
class LocationGroupController {
    constructor() {
        this.locationGroupService = new LocationGroupService_1.LocationGroupService();
        this.create = async (req, res) => {
            try {
                const requestData = req.body;
                const createdLocationGroup = await this.locationGroupService.create(requestData);
                res.status(201).json({
                    success: true,
                    data: createdLocationGroup.toJSON()
                });
            }
            catch (error) {
            }
        };
        this.getById = async (req, res, next) => {
            try {
                const id = Number(req.params.id);
                const locationGroup = await this.locationGroupService.getById(id);
                if (!locationGroup) {
                    throw new errors_1.NotFoundError(`Location group with id: ${id} not found`);
                }
                res.json({ locationGroup });
            }
            catch (error) {
                next(error);
            }
        };
        this.getAll = async (req, res) => {
            const locationGroups = await this.locationGroupService.getAll();
            res.json({
                success: true,
                data: locationGroups.map(lg => lg.toJSON())
            });
        };
        this.update = async (req, res) => {
            const id = Number(req.params.id);
            const updateData = req.body;
            const updatedLocationGroup = await this.locationGroupService.update(id, updateData);
            res.json({
                success: true,
                data: updatedLocationGroup.toJSON()
            });
        };
        this.delete = async (req, res) => {
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
        };
    }
}
exports.LocationGroupController = LocationGroupController;
//# sourceMappingURL=LocationGroupController.js.map