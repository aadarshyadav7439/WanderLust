const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
const ExpressError = require("./utils/ExpressError.js");
const wrapasync = require("./utils/wrapasync.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const mongoURL = "mongodb://localhost:27017/wanderlust";
async function main() {
    await mongoose.connect(mongoURL);
};

main().then(()=>{
    console.log("DB connection successful");
})
.catch((err)=>{
    console.log(err);
});

//session options
const sessionOptions={
    secret: "supersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000*60*60*24,
        maxAge : 1000 * 60 * 60 * 24,
        httpOnly : true,
    }
}

app.get("/", (req,res) => {
    res.send("Hi, I am the root route");
});

// using the session
app.use(session(sessionOptions));
app.use(flash());

//hum passport ko session ke baad me inmpelement karenge
//taki session chalne ke baad fir authentication ka process start ho

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //login karna
passport.deserializeUser(User.deserializeUser()); //logout karna

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get('/demouser', async(req,res)=>{
    let fakeUser = new User({
        email:"fake238@gmail.com",
        username: "im_fakeuser",
    });
    const newUsr = await User.register(fakeUser,"india123");
    res.send(newUsr);
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/testListing" , async (req,res) => {
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "By the beach",
//         price: 1200,
//         location : "Calanguta , Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Test Successfull");
// });


app.all("/*splat",(req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!!!"));
});

//middleware 
app.use((err,req,res,next)=>{
    let {statusCode =500, message="Wait Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs", {err});
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

