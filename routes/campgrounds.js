const express = require('express');
const catchAsync = require("./utils/catchAsync");
const { campgroundSchema } = require("./utils/schemaValidation");
const Campground = require("./models/campground");

const app = express();

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
app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

// New
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// Show/View/Details
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { campground });
}));

// Create
app.post("/campgrounds", validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
}));

// Edit
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        throw new AppError(500, "Could not find campground to be updated.");
    }
    res.render("campgrounds/edit", { campground });
}));

// Update
app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete
app.delete("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));