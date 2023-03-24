const express = require('express');
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require("../utils/schemaValidation");
const Campground = require("../models/campground");
const Review = require("../models/review");

const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new AppError(400, msg);
    } else {
        next();
    }
};

// Add review 
router.post("/", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${id}`);
}));

// Delete review
router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;