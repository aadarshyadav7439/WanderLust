const Listing = require("../models/listing.js");
const mongoose = require("mongoose")

module.exports.index = async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new_form.ejs");
};

module.exports.showListing = async (req,res) =>{
    let id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash("error", "Invalid Listing ID.");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id)
        .populate({
            path : "reviews",
            populate: {
                path : "author",
            }
        })
        .populate("owner");

    if(!listing) {
        req.flash("error" , "Requested Listing does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success" , "Listing has been added successfully");
    res.redirect("/listings"); 
};

module.exports.editForm = async (req,res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
};

module.exports.updateValue = async (req,res) => {
    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
    
        listing.image = {url,filename};
        await listing.save();
    }

    console.log(req.body.listing);
    req.flash("success" , "Listings has been modified!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res)=> {
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Deleted Successfully");
    res.redirect("/listings");
};