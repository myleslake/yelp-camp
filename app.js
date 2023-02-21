const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const path = require("path");

const Campground = require("./models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("ERROR: ")
        console.log(err);
    });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Home
app.get("/", (req, res) => {
    res.render("index");
});

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
app.get("/campgrounds/:id", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
});

// Create
app.post("/campgrounds", async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
});

// Edit
app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground })
});

// Update
app.put("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

// Delete
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
});

app.listen(3000, () => {
    console.log("Serving on port 3000...")
});