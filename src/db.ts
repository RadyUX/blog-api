import mysql from "mysql2/promise";  // Use the promise version of mysql2

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10, // Adjust according to your needs
    queueLimit: 0,
    keepAliveInitialDelay: 10000, // 0 by default.
    enableKeepAlive: true, 
});



export default pool;
