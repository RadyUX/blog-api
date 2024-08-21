"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userrouter = (0, express_1.Router)();
const userController = new user_controller_1.default();
userrouter.post('/create', userController.create);
exports.default = userrouter;
//# sourceMappingURL=user.route.js.map