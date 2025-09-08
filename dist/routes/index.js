"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hazardRoutes_1 = __importDefault(require("./hazardRoutes"));
const healthRoutes_1 = __importDefault(require("./healthRoutes"));
const databaseRoutes_1 = __importDefault(require("./databaseRoutes"));
const locationGroupRoute_1 = __importDefault(require("./locationGroupRoute"));
const router = (0, express_1.Router)();
router.use('/health', healthRoutes_1.default);
router.use('/api/test-db', databaseRoutes_1.default);
router.use('/api/hazards', hazardRoutes_1.default);
router.use('/api/locationGroup', locationGroupRoute_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map