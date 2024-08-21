"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_repository_1 = __importDefault(require("./repository/user.repository"));
const user_controller_1 = __importDefault(require("./controllers/user.controller"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const post_route_1 = __importDefault(require("./routes/post.route"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.use(express_1.default.json());
app.listen(PORT, () => {
    console.log(`Connected at http://localhost:${PORT}`);
    db_1.default;
});
app.get('/', (_req, res) => {
    return res.send('Express Typescript on Vercel');
});
const userController = new user_controller_1.default();
const userRepo = new user_repository_1.default();
app.use((0, cors_1.default)());
// Define the storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(__dirname, '../../client/public/upload');
        // Ensure the upload directory exists (creates if doesn't)
        fs_1.default.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                return null;
            }
            else {
                cb(null, uploadPath);
            }
        });
    },
    filename: function (req, file, cb) {
        // You could also customize the file naming convention here
        cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
// Initialize multer with the storage configuration
const upload = (0, multer_1.default)({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    res.status(200).json(file === null || file === void 0 ? void 0 : file.filename);
});
app.use('/', auth_route_1.default);
app.use('/', user_route_1.default);
app.use('/', post_route_1.default);
/*async function exampleUsage() {
  try {
      const newUser = {
          
          name: 'michel Doe',
          email: 'michszzzssel@example.com',
          password: 'securepassword',
          avatar: 'path/to/avatar.jpg'
      };
      const user = await userRepo.create(newUser);
      console.log("Created User:", user);
  } catch (error) {
      console.error("Error creating user:", error);
  }
}

exampleUsage();
  */ 
//# sourceMappingURL=index.js.map