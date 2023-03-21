const express = require('express');
const catchAsync = require("./utils/catchAsync");
const { campgroundSchema } = require("./utils/schemaValidation");
const Campground = require("./models/campground");

const app = express();

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
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}));

// Delete review
app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}));