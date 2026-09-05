const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("Dream page");
});

module.exports = router;
