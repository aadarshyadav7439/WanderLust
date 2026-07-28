const User = require("../models/user.js");


module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.userSignup = async(req,res) => {
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        //automatically logging after signup
        req.login(registeredUser,(err,next)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            res.redirect("/listings");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }   
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.userLogin = async (req,res)=>{
    req.flash("success", "Login Successful");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You're logged out");
        res.redirect("/listings");
    })
}