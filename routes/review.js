const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//reviews
router.post("/" , isLoggedIn ,validateReview, wrapAsync(reviewController.addingReview));

//deleting review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deletingReview));

module.exports = router;