import { Express } from "express";
import express from 'express'
import db from "./db"
import UserRepository from "./repository/user.repository";
import User from "./models/user.model";
import UserController from "./controllers/user.controller";
import authrouter from "./routes/auth.route";
import userrouter from "./routes/user.route";
import postrouter from "./routes/post.route";
import cors from "cors"
import multer from "multer";
import path from "path";
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()
import { Request, Response } from "express";
const app: Express = express()
const PORT = process.env.PORT || 8080

app.use(express.json());

  app.listen(PORT, () => {
    console.log(`Connected at http://localhost:${PORT}`);
    
    db
});



app.get('/ping', (_req: Request, res: Response) => {
  return res.send('pong 🏓')
})

const userController = new UserController()
const userRepo = new UserRepository(); 
app.use(cors())


// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../../client/public/upload');

    // Ensure the upload directory exists (creates if doesn't)
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        return null
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: function (req, file, cb) {
    // You could also customize the file naming convention here
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  res.status(200).json(file?.filename);
});

app.use('/', authrouter);
app.use('/', userrouter)
app.use('/', postrouter)

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