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

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');


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

app.get("/", (req,res) => {
    res.send("Hi, I am the root route");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
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

