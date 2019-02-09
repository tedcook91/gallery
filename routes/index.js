const express = require("express");
const router = express.Router();
const pictureController = require("../controllers/pictureController");
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(pictureController.getPictures));

router.get('/pictures', catchErrors(pictureController.getPictures));

router.get('/add', pictureController.addPicture);

router.post('/add/:id', 
    pictureController.upload,
    catchErrors(pictureController.resize),
    catchErrors(pictureController.updateStore)
);

router.post('/add/:id', pictureController.upload, catchErrors(pictureController.resize), catchErrors(pictureController.createPicture));

router.get('/pictures/:id/edit', catchErrors(pictureController.editPicture));

router.get('/picture/:slug', catchErrors(pictureController.getPictureBySlug));

module.exports = router;
