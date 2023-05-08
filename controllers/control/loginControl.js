const bcrypt = require("bcrypt");
const mysql = require("mysql2");
require("dotenv").config();
// create pool to connection database
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS
});
exports.login = (req, res) => {
  res.render("login")
}

exports.loginPost = (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username){
    console.log("Username or password is empty");
    res.render("login", { message: "Please enter both username and password" });
    return;
  }

  console.log(username,password)
  const sql = `SELECT * FROM users WHERE username =?`;
  const values = [username]
  pool.getConnection((err,connection) => {
    if (err) throw err //not connected
    console.log("connected to database :" + connection.threadId);
    connection.query(sql,values,(err,results) => {
      if(err) throw err;
      if(results.length > 0) {
        const user = results[0]
        //Verify password 
        if(bcrypt.compareSync(password,user.hash)){
          // password matched 
          console.log("User authenticated")
          req.session.authenticated = true;
          res.redirect("/")
        }else{
          if(password !==""){
            console.log("Incorrect password")
            res.render("login",{message: "Password Not Correct"})
          }else res.render("login",{message: "Please Write The Password"})
      }
      }else{
        //user not found 
        if(username !== ""){
          console.log("User not found")
          res.render("login",{message: "User Not Found"})
        }else{
          console.log("User not found")
          res.render("login",{message: "Please Write The UserName"})
        }
      }
    })
  })
}

// logout
exports.logout = (req,res) => {
  req.session.destroy((err) => {
    if(err) console.log("error destroying session")
    else res.redirect("/login")
  })
}