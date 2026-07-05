const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Project/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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


//Index route
app.get("/listings", async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

//get route for giving form
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new_form.ejs");
});
 
//show route 
app.get("/listings/:id",async (req,res) =>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
});

//create route
app.post("/listings",async (req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
});

//edit form request
app.get("/listings/:id/edit", async (req,res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

//updating the value
app.put("/listings/:id", async (req,res) => {
    let id = req.params.id;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.body.listing);
    res.redirect(`/listings/${id}`);
});
//delete route

app.delete("/listings/:id", async (req,res)=> {
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")

})
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});