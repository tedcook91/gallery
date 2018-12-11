const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictureController");
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', pictureController.homePage);
router.get('/pictures', catchErrors(pictureController.getPictures));
router.get('/add', pictureController.addPicture);
router.post('/add', catchErrors(pictureController.createPicture));

module.exports = router;
