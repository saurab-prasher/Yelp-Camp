const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");

const multer = require("multer");

const { storage } = require("../cloudinary");

const upload = multer({ storage });

const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");

const Campground = require("../models/campground");
const { populate } = require("../models/campground");

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    upload.single("image"),
    (req, res) => {
      console.log(req.body, req.file);
      res.send("IT WORKED!");
    }
    // isLoggedIn,
    // validateCampground,
    // catchAsync(campgrounds.createCampground)
  );

// Adds new campground ( By rendering Form) - (order matters)
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Edit each campground (Render form)
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
