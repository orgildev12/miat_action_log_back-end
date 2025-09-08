"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alogTestController_1 = require("../controllers/alogTestController");
const router = (0, express_1.Router)();
const alogTestController = new alogTestController_1.AlogTestController();
router.get('/', async (req, res) => {
    await alogTestController.getAllRecords(req, res);
});
router.post('/', async (req, res) => {
    await alogTestController.createRecord(req, res);
});
router.get('/:id', async (req, res) => {
    await alogTestController.getRecordById(req, res);
});
router.put('/:id', async (req, res) => {
    await alogTestController.updateRecord(req, res);
});
router.delete('/:id', async (req, res) => {
    await alogTestController.deleteRecord(req, res);
});
exports.default = router;
//# sourceMappingURL=alogTestRoutes.js.map