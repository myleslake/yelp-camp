const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});


// Cascading delete
campgroundSchema.post("findOneAndDelete", async document => {
    if (document) {
        await Review.deleteMany({
            _id: { $in: document.reviews }
        });
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);