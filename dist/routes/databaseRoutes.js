"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
const healthController = new healthController_1.HealthController();
router.get('/', async (req, res) => {
    await healthController.databaseTest(req, res);
});
exports.default = router;
//# sourceMappingURL=databaseRoutes.js.map