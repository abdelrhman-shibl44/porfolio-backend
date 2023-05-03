// ---- require main dependencies"
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const session = require("express-session");
const path = require("path");
const app = express();
require("dotenv").config();


// Configure session middleware
app.use(session({
  secret: "AaH9U10172",
  resave: false,
  saveUninitialized: false,
}));

// Create an instance of express app

//------get port from env or take 5050
const port = process.env.PORT || 6000;
//-------middleWars--------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//-------start server-------
// use router 
app.use("/", require("./controllers/routes/projects"));
//--static file from backend file--
app.use(express.static(path.join(__dirname, "public")));
// from front-end
app.use(express.static('../public'));
//-------template engine-------
const hbs = exhbs.create({ extname: ".hbs" });
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
// -----listen to port-------
app.listen(port, () => console.log(`port listening on ${process.env.port}`));