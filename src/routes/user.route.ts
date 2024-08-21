import { Router } from 'express';
import UserController from '../controllers/user.controller';


const userrouter = Router();
const userController = new UserController();

userrouter.post('/create', userController.create);

export default  userrouter;
