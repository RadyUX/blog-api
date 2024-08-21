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
const user_repository_1 = __importDefault(require("../repository/user.repository"));
class UserController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate request body
                const { name, email, password, avatar } = req.body;
                if (!name || !email || !password) { // Basic validation
                    return res.status(400).json({ message: "Missing required fields" });
                }
                // Create user using UserRepository
                const newUser = yield this.userRepository.create({
                    name,
                    email,
                    password,
                    avatar
                });
                return res.status(201).json(newUser);
            }
            catch (error) {
                console.error("Error creating user:", error);
                return res.status(500).json({ message: "Failed to create user" });
            }
        });
        this.userRepository = new user_repository_1.default();
        // Bind context to ensure 'this' refers to the class instance
        this.create = this.create.bind(this);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map