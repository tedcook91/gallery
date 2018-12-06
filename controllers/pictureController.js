exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
};

exports.addPicture = (req, res) => {
    res.render('editPicture', { title: 'Add Picture' });
};

exports.createPicture = (req, res) => {
    res.json(req.body);
};