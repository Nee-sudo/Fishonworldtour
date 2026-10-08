const express = require("express");
const mongoose = require("mongoose");
const FishSpot = require("../models/fishSpotModel");

const router = express.Router();
const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
const IMAGE_DATA_URL = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

router.get("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: "The sightings gallery is temporarily unavailable." });
        }

        const spots = await FishSpot.find()
            .select("+imageData displayName location story timestamp")
            .sort({ timestamp: -1 })
            .limit(8)
            .lean();

        res.json(spots);
    } catch (error) {
        console.error("Error fetching fish sightings:", error.message);
        res.status(500).json({ error: "Could not load fish sightings." });
    }
});

router.post("/", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: "The sightings gallery is temporarily unavailable. Please try again later." });
        }

        const { displayName, location, story, imageData, publicConsent } = req.body;
        if (typeof location !== "string" || !location.trim() || location.trim().length > 100) {
            return res.status(400).json({ error: "Please add a place (up to 100 characters)." });
        }
        if (displayName !== undefined && (typeof displayName !== "string" || displayName.trim().length > 40)) {
            return res.status(400).json({ error: "Your name must be 40 characters or fewer." });
        }
        if (story !== undefined && (typeof story !== "string" || story.trim().length > 240)) {
            return res.status(400).json({ error: "Your story must be 240 characters or fewer." });
        }
        if (typeof imageData !== "string") {
            return res.status(400).json({ error: "Please add a photo of your fish encounter." });
        }
        if (publicConsent !== true) {
            return res.status(400).json({ error: "Please confirm that this photo can be shared in the public gallery." });
        }

        const match = IMAGE_DATA_URL.exec(imageData);
        if (!match) {
            return res.status(400).json({ error: "Please upload a JPEG, PNG, or WebP image." });
        }

        const imageBuffer = Buffer.from(match[2], "base64");
        if (!imageBuffer.length || imageBuffer.length > MAX_IMAGE_BYTES) {
            return res.status(413).json({ error: "Your photo must be no larger than 2 MB." });
        }
        const isJpeg = imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8 && imageBuffer[2] === 0xff;
        const isPng = imageBuffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
        const isWebp = imageBuffer.toString("ascii", 0, 4) === "RIFF"
            && imageBuffer.toString("ascii", 8, 12) === "WEBP";
        const matchesMimeType = (match[1] === "jpeg" && isJpeg)
            || (match[1] === "png" && isPng)
            || (match[1] === "webp" && isWebp);
        if (!matchesMimeType) {
            return res.status(400).json({ error: "The uploaded photo does not match its image type." });
        }

        const spot = await FishSpot.create({
            displayName: displayName?.trim() || "A fish friend",
            location: location.trim(),
            story: story?.trim() || "",
            imageData
        });

        res.status(201).json({
            _id: spot._id,
            displayName: spot.displayName,
            location: spot.location,
            story: spot.story,
            imageData: spot.imageData,
            timestamp: spot.timestamp
        });
    } catch (error) {
        console.error("Error saving fish sighting:", error.message);
        res.status(500).json({ error: "Could not save your fish sighting. Please try again." });
    }
});

module.exports = router;
