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
const promise_1 = __importDefault(require("mysql2/promise"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_config_1 = __importDefault(require("./config/db.config"));
function seedAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield promise_1.default.createConnection({
                host: db_config_1.default.HOST,
                user: db_config_1.default.USER,
                password: db_config_1.default.PASSWORD,
                database: db_config_1.default.DB
            });
            const adminPassword = bcrypt_1.default.hashSync("1234", 5);
            const adminInfo = {
                id: 1,
                name: "Rafaelé",
                email: "rafaele.sinaguglia@gmail.com",
                avatar: "URL_ou_chemin_vers_avatar",
                password: adminPassword,
            };
            /*  const Users = Array.from({length: 5}, (_, index)=>({
                  id: index + 2 ,
                  name: faker.name.firstName(),
                  email: faker.internet.email(),
                  password: bcrypt.hashSync(faker.internet.password(), 10),
                  avatar: "URL_ou_chemin_vers_avatar"
              }))
      
              Users.forEach(user =>{
                  connection.execute("INSERT INTO users (id,name, email ,password, avatar) VALUES (?,?, ?, ?, ?)",
                      [user.id, user.name, user.email, user.password, user.avatar])
              }
      
              )*/
            const sql = `INSERT INTO admin (id,name, email,  avatar,password) VALUES (?, ?, ?, ?, ?)`;
            const values = [adminInfo.id, adminInfo.name, adminInfo.email, adminInfo.avatar, , adminInfo.password];
            yield connection.execute(sql, values);
            console.log('Admin inserted successfully');
            yield connection.end();
        }
        catch (error) {
            console.error('Failed to seed admin:', error);
        }
    });
}
seedAdmin();
//# sourceMappingURL=seed.js.map