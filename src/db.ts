import dbConfig from "./config/db.config";
import mysql from "mysql2"

const db = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
  });

 db.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  

  export default db