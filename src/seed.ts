import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dbConfig from './config/db.config';
import { faker } from '@faker-js/faker';

async function seedAdmin() {
    try {
        const connection = await mysql.createConnection({
            host: dbConfig.HOST,
            user: dbConfig.USER,
            password: dbConfig.PASSWORD,
            database: dbConfig.DB
        });

        const adminPassword = bcrypt.hashSync("1234", 5);
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
        const values = [adminInfo.id,adminInfo.name, adminInfo.email, adminInfo.avatar,, adminInfo.password];

        await connection.execute(sql, values);
        console.log('Admin inserted successfully');

        await connection.end();
    } catch (error) {
        console.error('Failed to seed admin:', error);
    }
}

seedAdmin();
