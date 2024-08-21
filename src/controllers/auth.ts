import { Request, Response } from 'express';
import AuthRepository from '../repository/auth.repository';
import User from '../models/user.model';
import Admin from '../models/admin.model';
import jwt from "jsonwebtoken"
class AuthController {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    public login = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;

        try {
            const { account, isAdmin } = await this.authRepository.login(email, password);
            const token = jwt.sign({ id: account.id, isAdmin }, 'jwtkey', { expiresIn: '1h' });

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
            },);
            console.log(isAdmin)
            console.log(account.name)
        } catch (error: Error | any) {
            res.status(400).json({
                message: 'Login failed',
                error: error.message
            });
        }
    };

    public logout = (req: Request, res: Response) => {
        res.clearCookie("access_token",{
          sameSite:"none",
          secure:true
        }).status(200).json("User has been logged out.")
      };
}

export default AuthController;
