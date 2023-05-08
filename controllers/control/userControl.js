const mysql = require("mysql2");
require("dotenv").config();
const bcrypt = require("bcrypt")
// create pool to connection database
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
});

// ---------Create a tabel for stroing user data--------
const createUserTable = () => {
  const sql =`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      hash VARCHAR(255) NOT NULL
    )
    `
    pool.query(sql, (err) => {
      if (err) throw err;
      console.log("User table created")
    });
}
createUserTable()
// ---------generate password function----------
const generatePassword = () =>{
  // generate username and password 
  const username = "abdelrhman";
  const password = "AaH9U10172#";
  // Generate salt and hash password 
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password,salt)
// Insert user data into mysql 
const sql = `
  INSERT INTO users (username,salt,hash)
  VALUES(?,?,?)
`;
const values = [username,salt,hash]
pool.query(sql,values,(err) => {
  if(err) throw err;
  console.log("User data inserted")
})
}
generatePassword()