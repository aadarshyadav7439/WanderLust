const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
        type: String,
        default: "https://img.favpng.com/16/25/14/hotel-colored-hotel-icon-for-travel-igmXdyZm_t.jpg",
        set: (v) =>
        v === ""
            ? "https://img.favpng.com/16/25/14/hotel-colored-hotel-icon-for-travel-igmXdyZm_t.jpg"
            : v,
    },
    
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;