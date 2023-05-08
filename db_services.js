
const mysql = require("mysql2");
require("dotenv").config();
const pool = mysql.createPool({
	connectionLimit: 100,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
});
pool.getConnection((err, connection) => {
	if (err) throw err;
	console.log(`conntected to database ${connection.threadId}`);
});
