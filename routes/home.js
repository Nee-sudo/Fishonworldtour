const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const Comment = require("../models/commentModel");
const { countries } = require("countries-list");

const sendFrontend = (res) => {
    const distIndex = path.join(__dirname, "..", "fish-journey", "dist", "index.html");
    const publicIndex = path.join(__dirname, "..", "fish-journey", "index.html");
    const isProduction = Boolean(process.env.VERCEL || process.env.NODE_ENV === "production");

    if (fs.existsSync(distIndex)) {
        return res.sendFile(distIndex);
    }

    if (fs.existsSync(publicIndex) && !isProduction) {
        return res.sendFile(publicIndex);
    }

    return res.status(200).send("Fish on World Tour");
};

router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find().sort({ timestamp: -1 });
        const countryList = Object.values(countries).map(country => ({
            name: country.name,
            code: country.code
        })).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        // Preserve the legacy data for future use without depending on an EJS template folder.
        if (comments && countryList) {
            return sendFrontend(res);
        }

        return sendFrontend(res);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return sendFrontend(res);
    }
});

module.exports = router;