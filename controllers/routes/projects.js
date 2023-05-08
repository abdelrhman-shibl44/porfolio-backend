const express = require("express");
const router = express.Router();
const controll = require('../control/projectsControl')
const controlRoutes = require('../control/loginControl')
const controlEamil = require('../control/emailControl')
//require build username and password 
require("../control/userControl")
// use this middleware to upload images 
const multer = require("multer")
const storage = multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null,'../public/images')
  },
  filename:(req,file,cb) => {
    cb(null,file.originalname)
  }
})
const isAuthenticated = (req, res, next) => {
  if (req.session.authenticated) {
    console.log(`from here ${req.session.authenticated}`)
    // User is authenticated, proceed to next middleware or route handler
    return next();
  } else {
    // User is not authenticated, redirect to login page
    return res.redirect('/login');
  }
};
const upload = multer({storage:storage}).single('img')

// Route handlers with isAuthenticated middleware
router.get("/",isAuthenticated, controll.home);
router.post("/",isAuthenticated, controll.find);
router.get("/editProject/:id",isAuthenticated, controll.edit);
router.get("/delete/:id",isAuthenticated, controll.delete);
router.post("/delete",isAuthenticated, controll.remove);

// page
router.get("/form", controll.form);
router.post("/form",upload, controll.add);
router.get("/editProject/:id", controll.edit);
router.post("/editProject/:id",upload, controll.update);
router.get("/delete/:id", controll.delete);
router.post("/", controll.find);
router.post("/delete", controll.remove);
router.get("/getData", controll.data);
router.get("/login", controlRoutes.login);
router.post("/login" ,controlRoutes.loginPost);
router.get("/auth/logout",isAuthenticated ,controlRoutes.logout);
//control client info
router.post("/api/send-email", controlEamil.email);

module.exports = router
