import dbConfig from "./config/db.config";
import mysql from "mysql2"

const db = mysql.createConnection({
    host: process.env.HOST,
    user:  process.env.USER,
    password:  process.env.PASSWORD,
    database:  process.env.DB
  });

 db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  

  export default db