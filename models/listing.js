const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/042/637/639/small/luxe-living-badge-opulent-modern-villa-icon-for-premium-branding-urban-utopia-insignia-stylish-emblem-with-modern-villa-design-vector.jpg",
    set: (v) =>
      v === ""
        ? "https://img.favpng.com/16/25/14/hotel-colored-hotel-icon-for-travel-igmXdyZm_t.jpg"
        : v,
  },

  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
});

listingSchema.post("findOneAndDelete", async function(listing){
  await Review.deleteMany({_id: {$in: listing.reviews}});
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
