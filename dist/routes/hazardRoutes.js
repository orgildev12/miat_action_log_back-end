"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hazardController_1 = require("../controllers/hazardController");
const router = (0, express_1.Router)();
const hazardController = new hazardController_1.HazardController();
router.get('/', async (req, res) => {
    await hazardController.getAll(req, res);
});
router.post('/', async (req, res) => {
    await hazardController.create(req, res);
});
router.get('/:id', async (req, res) => {
    await hazardController.getById(req, res);
});
router.put('/:id', async (req, res) => {
    await hazardController.update(req, res);
});
router.delete('/:id', async (req, res) => {
    await hazardController.delete(req, res);
});
exports.default = router;
//# sourceMappingURL=hazardRoutes.js.map