"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = __importDefault(require("./config/db.config"));
const mysql2_1 = __importDefault(require("mysql2"));
const db = mysql2_1.default.createConnection({
    host: db_config_1.default.HOST,
    user: db_config_1.default.USER,
    password: db_config_1.default.PASSWORD,
    database: db_config_1.default.DB
});
db.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});
exports.default = db;
//# sourceMappingURL=db.js.map