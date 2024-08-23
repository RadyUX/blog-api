import mysql from "mysql2";

// Function to create a connection
function createConnection() {
    return mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DB
    });
}

// Initialize connection
let db = createConnection();

// Function to reconnect if the connection is lost
function handleDisconnect() {
    db.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.fatal) {
            console.error('Database connection was closed or encountered a fatal error. Reconnecting...');
            db = createConnection();  // Recreate the connection
            handleDisconnect();  // Reattach the error handler to the new connection
            db.connect((error) => {
                if (error) {
                    console.error('Error reconnecting to the database:', error);
                    setTimeout(handleDisconnect, 2000);  // Retry after a delay
                } else {
                    console.log('Reconnected to the database.');
                }
            });
        } else {
            throw err;  // Other errors should not be ignored
        }
    });
}

// Attach the handler to the initial connection
handleDisconnect();

// Export the connection
export default db;
