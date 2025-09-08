"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LocationGroupController_1 = require("../controllers/LocationGroupController");
const router = (0, express_1.Router)();
const locationGroupController = new LocationGroupController_1.LocationGroupController();
router.get('/', async (req, res) => {
    await locationGroupController.getAll(req, res);
});
router.post('/', async (req, res) => {
    await locationGroupController.create(req, res);
});
router.get('/:id', async (req, res) => {
    await locationGroupController.getById(req, res);
});
router.put('/:id', async (req, res) => {
    await locationGroupController.update(req, res);
});
router.delete('/:id', async (req, res) => {
    await locationGroupController.delete(req, res);
});
exports.default = router;
//# sourceMappingURL=locationGroupRoute.js.map