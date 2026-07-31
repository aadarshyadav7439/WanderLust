const Listing = require("../models/listing.js");
const mongoose = require("mongoose")


module.exports.index = async (req, res) => {
    const { search, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 18;
    const skip = (page - 1) * limit;
    let query = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
        ];
    }
    if (category) {
        query.category = category;
    }
    const totalListings = await Listing.countDocuments(query);
    const allListings = await Listing.find(query)
        .skip(skip)
        .limit(limit);
    res.render("./listings/index.ejs", {
        allListings,
        currentPage: page,
        totalPages: Math.ceil(totalListings / limit),
        search,
        category,
    });
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
    if(!listing){
        req.flash("error","Requested listing doesn't exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,e_blur:100");
    console.log(originalImageUrl);
    res.render("./listings/edit.ejs",{listing , originalImageUrl});
};

module.exports.updateValue = async (req,res) => {
    let id = req.params.id;
    // If no category is selected, save an empty array
    if (!req.body.listing.category) {
        req.body.listing.category = [];
    }

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

module.exports.filterCategory = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({
        category: category,
    });
    res.render("listings/index.ejs", { allListings });
};