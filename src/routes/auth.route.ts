import { Router } from 'express';
import AuthController from '../controllers/auth';

const authrouter = Router();
const authController = new AuthController();

authrouter.post('/login', authController.login);
authrouter.post('/logout' , authController.logout)
export default  authrouter;
