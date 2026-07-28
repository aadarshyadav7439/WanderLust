const express = require('express');
const router = express.Router();
const wrapasync = require('../utils/wrapasync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/users.js");

//signup section
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapasync(userController.userSignup));


//login section
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
    passport.authenticate('local',{failureRedirect : "/login", failureFlash: true}), userController.userLogin );

//logout section
router.get("/logout", userController.userLogout);

module.exports = router;