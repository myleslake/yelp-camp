const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    rating: Number,
    text: String,
    name: String
});

module.exports = mongoose.model("Review", ReviewSchema);