const express = require("express");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("CONNECTION OPEN!")
    })
    .catch(err => {
        console.log("ERROR: ")
        console.log(err);
    });

const app = express();

app.get("/", (req, res) => {
    res.send("home");
});

app.get("/campgrounds", (req, res) => {
    res.send("campground");
});

app.listen(3000, () => {
    console.log("Serving on port 3000...")
});