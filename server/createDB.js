const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'mottu@123'
        });
        
        const dbName = process.env.DB_NAME || 'bus_pass_management';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or already exists.`);
        await connection.end();
    } catch (error) {
        console.error('Error creating database:', error.message);
        process.exit(1);
    }
}

createDatabase();
