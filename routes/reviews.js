const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const reviews = require("../controllers/reviews");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//* REVIEW ROUTES

// ADDING REVIEWS
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// DELETING REVIEWS
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
