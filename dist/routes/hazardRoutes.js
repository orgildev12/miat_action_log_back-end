"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hazardController_1 = require("../controllers/hazardController");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
const hazardController = new hazardController_1.HazardController();
router.get('/', (0, asyncHandler_1.asyncHandler)(hazardController.getAll));
router.post('/', (0, asyncHandler_1.asyncHandler)(hazardController.create));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(hazardController.getById));
router.put('/:id', (0, asyncHandler_1.asyncHandler)(hazardController.update));
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(hazardController.delete));
exports.default = router;
//# sourceMappingURL=hazardRoutes.js.map