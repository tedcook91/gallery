const mongoose = require('mongoose');
const Picture = mongoose.model('Picture')

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};

exports.addPicture = (req, res) => {
    res.render('editPicture', { title: 'Add Picture' });
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