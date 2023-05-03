const express = require("express");
const router = express.Router();
const controll = require('../control/projectsControl')
const controlRoutes = require('../control/loginControl')
const controlEamil = require('../control/emailControl')
// use this middleware to upload images 
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

// Route handlers with isAuthenticated middleware
router.get("/",isAuthenticated, controll.home);
router.post("/",isAuthenticated, controll.find);
router.get("/editProject/:id",isAuthenticated, controll.edit);

// page
router.get("/form", controll.form);
router.post("/form", controll.add);
router.get("/editProject/:id", controll.edit);
router.post("/editProject/:id", controll.update);
router.post("/", controll.find);
router.get("/login", controlRoutes.login);
router.get("/auth/logout",isAuthenticated ,controlRoutes.logout);
//control client info
router.post("/api/send-email", controlEamil.email);

module.exports = router
