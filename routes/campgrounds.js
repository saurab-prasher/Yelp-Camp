const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas.js");

// Middleware function for error handling using JOI
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Render all campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});

    res.render("campgrounds/index", { campgrounds });
  })
);

// Adds new campground ( By rendering Form) - (order matters)
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// Handle Post request received by (Add new campground using form)
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// See Individual campground (order matters)
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

// Adds new campground ( By rendering Form) - (order matters)
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

// Edit each campground (Render form)
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Can't find that campground!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

// Edit campground by PUT request (resouce/?_method=PUT)
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(
      id,
      {
        ...req.body.campground,
      },
      { new: true, runValidators: true }
    );
    req.flash("success", "Successfully updated campground! ");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete individual Items
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
