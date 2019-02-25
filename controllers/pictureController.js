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
};

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addPicture = (req, res) => {
  res.render('editPicture', { title: 'Add Picture' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createPicture = async (req, res) => {
  const picture = await (new Picture(req.body)).save();
  req.flash('success', `Successfully Created ${picture.name}. Care to leave a review?`);
  res.redirect(`/picture/${picture.slug}`);
};

exports.getPictures = async (req, res) => {
  // 1. Query the database for a list of all pictures
  const pictures = await Picture.find();
  res.render('pictures', { title: 'Pictures', pictures });
};

exports.editPicture = async (req, res) => {
  // 1. Find the picture given the ID
  const picture = await Picture.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the picture
  // TODO
  // 3. Render out the edit form so the user can update their picture
  res.render('editPicture', { title: `Edit ${picture.name}`, picture });
};

exports.updatePicture = async (req, res) => {
  // set the location data to be a point
  req.body.location.type = 'Point';
  // find and update the picture
  const picture = await Picture.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new picture instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${picture.name}</strong>. <a href="/pictures/${picture.slug}">View Picture →</a>`);
  res.redirect(`/pictures/${picture._id}/edit`);
  // Redriect them the picture and tell them it worked
};

exports.getPictureBySlug = async (req, res, next) => {
  const picture = await Picture.findOne({ slug: req.params.slug });
  if (!picture) return next();
  res.render('picture', { picture, title: picture.name });
};

exports.getPicturesByTag = async (req, res) => {
  const tags = await Picture.getTagsList();
  const tag = req.params.tag;
  res.render('tag', { tags, title: 'Tags', tag });
};