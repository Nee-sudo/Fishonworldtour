const mongoose = require("mongoose");

const fishSpotSchema = new mongoose.Schema({
    displayName: { type: String, trim: true, maxlength: 40, default: "A fish friend" },
    location: { type: String, required: true, trim: true, maxlength: 100 },
    story: { type: String, trim: true, maxlength: 240, default: "" },
    imageData: { type: String, required: true, select: false },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("FishSpot", fishSpotSchema);
