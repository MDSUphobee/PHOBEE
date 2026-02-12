import mysql from 'mysql2/promise';

console.log(`Initialisation de la connexion DB: Host=${process.env.DB_HOST}, Port=${process.env.DB_PORT}, User=${process.env.DB_USER}, DB=${process.env.DB_NAME}`);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
