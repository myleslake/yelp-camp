const express = require('express');
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../utils/schemaValidation");
const Campground = require("../models/campground");

const router = express.Router();

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new AppError(400, msg);
    } else {
        next();
    }
};

// Index/List
router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

// New
router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

// Show/View/Details
router.get("/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { campground });
}));

// Create
router.post("", validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "Campground created!");
    res.redirect(`campgrounds/${campground._id}`);
}));

// Edit
router.get("/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        throw new AppError(500, "Could not find campground to be updated.");
    }
    res.render("campgrounds/edit", { campground });
}));

// Update
router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    req.flash("success", "Campground updated!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete
router.delete("/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted!");
    res.redirect("/campgrounds");
}));

module.exports = router;