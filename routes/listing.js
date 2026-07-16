const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");



//validation of schema of listings
const validateSchema = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

//Index route
router.get("/",wrapAsync( async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));

//get route for giving form
router.get("/new",(req,res)=>{
    res.render("./listings/new_form.ejs");
});

 
//show route 
router.get("/:id", wrapAsync(async (req,res) =>{
    let id = req.params.id;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}));

//create route
router.post("/",validateSchema, wrapAsync(async (req,res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings"); 
}));

//edit form request
router.get("/:id/edit",wrapAsync( async (req,res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

//updating the value
router.put("/:id",validateSchema,wrapAsync( async (req,res) => {
    let id = req.params.id;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(req.body.listing);
    res.redirect(`/listings/${id}`);
}));

//delete route

router.delete("/:id",wrapAsync( async (req,res)=> {
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;