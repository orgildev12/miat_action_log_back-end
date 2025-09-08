"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LocationGroupController_1 = require("../controllers/LocationGroupController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const locationGroupController = new LocationGroupController_1.LocationGroupController();
router.get('/', (0, asyncHandler_1.asyncHandler)(locationGroupController.getAll));
router.post('/', (0, asyncHandler_1.asyncHandler)(locationGroupController.create));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(locationGroupController.getById));
router.put('/:id', (0, asyncHandler_1.asyncHandler)(locationGroupController.update));
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(locationGroupController.delete));
exports.default = router;
//# sourceMappingURL=locationGroupRoute.js.map