//auth.repository.ts


import { resolve } from "path";
import db from "../db";
import Admin from "../models/admin.model";
import User from "../models/user.model";
import bcrypt from "bcrypt"
import { RowDataPacket } from "mysql2";
import { rejects } from "assert";


interface IAuthRepository{
    login(email: string, password: string):Promise<{ account: User | Admin, isAdmin: boolean }>;
 
}



class AuthRepository implements IAuthRepository {
    
    async login(email: string, password: string): Promise<{ account: User | Admin, isAdmin: boolean }>{
        return new Promise((resolve, reject) => {
            const userQuery = "SELECT * FROM users WHERE email = ?";
            const adminQuery = "SELECT * FROM admin WHERE email = ?";
            
            // Exécutez les deux requêtes en parallèle
            Promise.all([
                new Promise<RowDataPacket[]>((resolve, reject) => {
                    db.query<RowDataPacket[]>(userQuery, [email], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                }),
                new Promise<RowDataPacket[]>((resolve, reject) => {
                    db.query<RowDataPacket[]>(adminQuery, [email], (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    });
                })
            ])
            .then(async ([userResult, adminResult]) => {
                let accountData = userResult[0] || adminResult[0];
                let isAdmin = false;

                if (adminResult.length > 0) {
                    accountData = adminResult[0];
                    isAdmin = true;
                }
                if (accountData) {
                    const passwordIsValid = await bcrypt.compare(password, accountData.password);

                    if (passwordIsValid) {
                        const account: User | Admin = {
                            id: accountData.id,
                            name: accountData.name,
                            email: accountData.email,
                            password: accountData.password,
                            avatar: accountData.avatar,
                          
                        };

                        
                        resolve({ account, isAdmin });
                    } else {
                        reject(new Error("Password is incorrect"));
                     
                    }
                } else {
                    reject(new Error("User not found"));
                }
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    

}
export default AuthRepository