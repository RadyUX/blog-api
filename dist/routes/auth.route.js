"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../controllers/auth"));
const authrouter = (0, express_1.Router)();
const authController = new auth_1.default();
authrouter.post('/login', authController.login);
authrouter.post('/logout', authController.logout);
exports.default = authrouter;
//# sourceMappingURL=auth.route.js.map