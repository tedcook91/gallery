const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out! 👋');
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
        next(); // carry on! They are logged in!
        return;
    }
    req.flash('error', 'Oops you must be logged in to do that!');
    res.redirect('/admin');
};

exports.forgot = async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email })
    if(!admin) {
        req.flash('error', 'No account with that email exists.');
        return res.redirect('/admin')
    }
    admin.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordExpires = Date.now() + 3600000;
    await admin.save();
    const resetURL = `http://${req.headers.host}/reset/${admin.resetPasswordToken}`;
    req.flash('success', `You have been emailed a password reset link. ${resetURL}`);
    res.redirect('/admin')
};

exports.reset = async (req, res) => {
    const admin = await Admin.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now()}
    });
    if (!admin) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/admin');
    }
    res.render('reset', { title: 'Reset your Password'});
};

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['password-confirm']) {
        next();
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
}

exports.update = async (req, res) => {
    const admin = await Admin.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!admin) {
        req.flash('error', 'Password reset is invalid or has expired');
        return res.redirect('/admin');
    }
    const setPassword = promisify(admin.setPassword, admin)
    await setPassword(req.body.password);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpires = undefined;
    const updatedAdmin = await admin.save();
    await req.login(updatedAdmin);
    req.flash('success', 'Your password has been reset!');
    res.redirect('/');
};