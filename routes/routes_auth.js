const bcrypt = require('bcryptjs'),
    express = require('express'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    { secretOrKey } = require('../config/keys'),
    { User } = require('../models');
//==========================================================================
const router = express.Router();
const validateRegisterInput = require('../validation/signup');
const validateLoginInput = require('../validation/login');
//==========================================================================
//@route    POST: /auth/signup
//@desc     Sign-Up Functionality
//@access   Public

router.post('/signup', validateRegisterInput, async (req, res) => {
    let { firstName, lastName, email, password, gender } = req.body;
    if (isEmpty(gender)) gender = 'None';
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ email: 'Email already registered!' });

    let newUser = new User({ firstName, lastName, email, gender, profilePic, regMode: 'native' });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser = await newUser.save();
            res.json(newUser);
        });
    });
});
//==========================================================================
//@route    POST: /auth/login
//@desc     Login user and generate token
//@access   Public

router.post('/login', validateLoginInput, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ email: 'User not found!' });
    if (!user.password || user.regMode !== 'native')
        return res.status(400).json({ email: 'User not registered locally!' });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).json({ password: 'password incorrect!' });

    const payload = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        gender: req.user.gender,
        profilePic: req.user.profilePic,
    };
    jwt.sign(payload, secretOrKey, { expiresIn: '7 days' }, (err, token) => {
        res.json({
            success: true,
            token: 'Bearer ' + token,
        });
    });
});
// ============================================================================
//@route    GET: /auth/google/*
//@desc     Signup/Login using GoogleStrategy
//@access   Public

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/redirect', passport.authenticate('google', { session: false }), (req, res) => {
    const payload = {
        id: req.user.id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        gender: req.user.gender,
        profilePic: req.user.profilePic,
    };
    jwt.sign(payload, secretOrKey, { expiresIn: '7 days' }, (err, token) => {
        res.json({
            success: true,
            token: 'Bearer ' + token,
        });
    });
});
// ============================================================================
//@route    POST:
//@desc
//@access

// ============================================================================
//@route    POST:
//@desc
//@access

// ============================================================================
//@route    POST:
//@desc
//@access

// ============================================================================
//@route    POST:
//@desc
//@access

// ============================================================================
//@route    POST:
//@desc
//@access

//==========================================================================
//@route    POST: /auth/current
//@desc     Return Current user
//@access   Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});
//==========================================================================
module.exports = router;
