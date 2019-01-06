const mongoose = require('mongoose');
const Picture = mongoose.model('Picture');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
}

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};

exports.addPicture = (req, res) => {
    res.render('editPicture', { title: 'Add Picture' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    //check if there is no new file to resize
    if(!req.file) {
        next(); //skip to next middleware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    next();
};

exports.createPicture = async (req, res) => {
    const picture = await (new Picture(req.body)).save();
    req.flash('success', `Successfully Created ${picture.name}.`)
    res.redirect(`/picture/${picture.slug}`);
};

exports.getPictures = async (req, res) => {
    const pictures = await Picture.find();
    res.render('pictures', { title: 'Pictures', pictures });
};