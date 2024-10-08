import dbConfig from "./config/db.config";
import mysql from "mysql2"

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 20000 // 10 seconds
});

pool.getConnection(function(err) {
  if (err) {
      console.error('Error connecting to the database:', err);
      throw err;
  }
  console.log("Connected!");
});


  export default pool