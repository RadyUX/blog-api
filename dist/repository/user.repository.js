"use strict";
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
class UserRepository {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // Hachage du mot de passe
                    const hashedPassword = yield bcrypt_1.default.hash(user.password, 5);
                    const sql = 'INSERT INTO users (id, name, email, password, avatar) VALUES (?, ?, ?, ?, ?)';
                    db_1.default.query(sql, [user.id, user.name, user.email, hashedPassword, user.avatar], (err, res) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            console.log('User created with ID:', user.id);
                            resolve(Object.assign(Object.assign({}, user), { id: user.id, password: hashedPassword // Retourne le mot de passe haché
                             }));
                        }
                    });
                }
                catch (error) {
                    reject(error);
                }
            }));
        });
    }
    userByEmail(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const sql = 'SELECT * FROM users WHERE email = ?';
                db_1.default.query(sql, [userEmail], (err, res) => {
                    if (err) {
                        reject(err);
                        console.log(err);
                    }
                    else {
                        if (res.length > 0) {
                            const user = {
                                id: res[0].id,
                                name: res[0].name,
                                email: res[0].email,
                                password: res[0].password,
                                avatar: res[0].avatar,
                            };
                            resolve(user);
                        }
                        else {
                            resolve(undefined);
                        }
                    }
                });
            });
        });
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map