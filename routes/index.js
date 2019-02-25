const express = require('express');
const router = express.Router();
const pictureController = require('../controllers/pictureController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(pictureController.getPictures));
router.get('/pictures', catchErrors(pictureController.getPictures));
router.get('/add', pictureController.addPicture);

router.post('/add',
    pictureController.upload,
    catchErrors(pictureController.resize),
    catchErrors(pictureController.createPicture)
);

router.post('/add/:id',
    pictureController.upload,
    catchErrors(pictureController.resize),
    catchErrors(pictureController.updatePicture)
);

router.get('/pictures/:id/edit', catchErrors(pictureController.editPicture));
router.get('/picture/:slug', catchErrors(pictureController.getPictureBySlug));

router.get('/tags', catchErrors(pictureController.getPicturesByTag));
router.get('/tags/:tag', catchErrors(pictureController.getPicturesByTag));

module.exports = router;