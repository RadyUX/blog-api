import {  ResultSetHeader} from "mysql2";
import db from "../db";
import { RowDataPacket } from 'mysql2';
import User from "../models/user.model";
import bcrypt from "bcrypt"
// interface du repo
interface IUserRepository {
    create(user: User): Promise<User>;
    userByEmail(userEmail: string):Promise<User | undefined>
}

class UserRepository implements IUserRepository {

    async create(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                // Hachage du mot de passe
                const hashedPassword = await bcrypt.hash(user.password, 5);
                const sql = 'INSERT INTO users (id, name, email, password, avatar) VALUES (?, ?, ?, ?, ?)';
                db.query<ResultSetHeader>(
                    sql,
                    [user.id, user.name, user.email, hashedPassword, user.avatar],
                    (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('User created with ID:', user.id);
                            resolve({
                                ...user,
                                id: user.id,
                                password: hashedPassword // Retourne le mot de passe haché
                            });
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    async userByEmail(userEmail: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE email = ?';
            db.query<RowDataPacket[]>(sql, [userEmail], (err, res) => {
                if (err) {
                    reject(err);
                    console.log(err);
                } else {
                    if (res.length > 0) {
                        const user: User = {
                            id: res[0].id,
                            name: res[0].name,
                            email: res[0].email,
                            password: res[0].password,
                            avatar: res[0].avatar,
                        };
                        resolve(user);
                    } else {
                        resolve(undefined);
                    }
                }
            });
        });
    
    }

}
export default UserRepository