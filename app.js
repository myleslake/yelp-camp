const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const path = require("path");
const AppError = require("./utils/AppError");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("CONNECTION OPEN!");
    })
    .catch((err) => {
        console.log("ERROR: ");
        console.log(err);
    });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
    secret: 'pretendthisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews)

// Home
app.get("/", (req, res) => {
    res.render("index");
});

app.all("*", (req, res, next) => {
    next(new AppError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "An unexpected error has occurred.";
    res.status(status).render("error", { err });
});

app.listen(3000, () => {
    console.log("Serving on port 3000...");
});
