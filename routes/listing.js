const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });


const {isLoggedIn, isOwner, validateSchema} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//index and create router
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn ,validateSchema,upload.single("listing[image]"),wrapAsync(listingController.createListing));

//get route for giving form
router.get("/new", isLoggedIn , listingController.renderNewForm);

//show, update and delete respectively.
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner ,validateSchema,upload.single("listing[image]"),wrapAsync(listingController.updateValue))
.delete(isLoggedIn , isOwner ,wrapAsync(listingController.deleteListing));

//edit form request
router.get("/:id/edit",isLoggedIn , isOwner ,wrapAsync(listingController.editForm));

module.exports = router;