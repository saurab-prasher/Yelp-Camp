const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");

const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");

const Campground = require("../models/campground");
const { populate } = require("../models/campground");

// Render all campgrounds
router.get("/", catchAsync(campgrounds.index));

// Adds new campground ( By rendering Form) - (order matters)
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// Handle Post request received by (Add new campground using form)
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// See Individual campground (order matters)
router.get("/:id", catchAsync(campgrounds.showCampground));

// Edit each campground (Render form)
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

// Edit campground by PUT request (resouce/?_method=PUT)
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

// Delete campgrounds
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
