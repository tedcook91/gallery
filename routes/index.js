const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictureController");

// Do work here
router.get("/", pictureController.homePage);
router.get("/add", pictureController.addPicture);
// router.post('/add', pictureController.addPicture;

module.exports = router;
