"use strict";
//auth.repository.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthRepository {
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const userQuery = "SELECT * FROM users WHERE email = ?";
                const adminQuery = "SELECT * FROM admin WHERE email = ?";
                // Exécutez les deux requêtes en parallèle
                Promise.all([
                    new Promise((resolve, reject) => {
                        db_1.default.query(userQuery, [email], (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        db_1.default.query(adminQuery, [email], (err, result) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    })
                ])
                    .then((_a) => __awaiter(this, [_a], void 0, function* ([userResult, adminResult]) {
                    let accountData = userResult[0] || adminResult[0];
                    let isAdmin = false;
                    if (adminResult.length > 0) {
                        accountData = adminResult[0];
                        isAdmin = true;
                    }
                    if (accountData) {
                        const passwordIsValid = yield bcrypt_1.default.compare(password, accountData.password);
                        if (passwordIsValid) {
                            const account = {
                                id: accountData.id,
                                name: accountData.name,
                                email: accountData.email,
                                password: accountData.password,
                                avatar: accountData.avatar,
                            };
                            resolve({ account, isAdmin });
                        }
                        else {
                            reject(new Error("Password is incorrect"));
                        }
                    }
                    else {
                        reject(new Error("User not found"));
                    }
                }))
                    .catch(err => {
                    reject(err);
                });
            });
        });
    }
}
exports.default = AuthRepository;
//# sourceMappingURL=auth.repository.js.map