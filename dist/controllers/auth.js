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
const auth_repository_1 = __importDefault(require("../repository/auth.repository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const { account, isAdmin } = yield this.authRepository.login(email, password);
                const token = jsonwebtoken_1.default.sign({ id: account.id, isAdmin }, 'jwtkey', { expiresIn: '1h' });
                res.cookie('access_token', token, { httpOnly: true });
                res.status(200).json({
                    message: 'Login successful',
                    user: {
                        id: account.id,
                        name: account.name,
                        email: account.email,
                        avatar: account.avatar,
                    },
                    token
                });
                console.log(isAdmin);
                console.log(account.name);
            }
            catch (error) {
                res.status(400).json({
                    message: 'Login failed',
                    error: error.message
                });
            }
        });
        this.logout = (req, res) => {
            res.clearCookie("access_token", {
                sameSite: "none",
                secure: true
            }).status(200).json("User has been logged out.");
        };
        this.authRepository = new auth_repository_1.default();
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.js.map