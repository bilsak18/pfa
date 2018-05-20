const express = require('express');
const authRouter = express.Router();
const passport = require('passport');

const authController = require('../controllers/authController');


const router = (con, navbar) => {
    const { signUp, logOut, middleware } = authController(con, navbar);

    authRouter.route('/signUp')
        .post(signUp);

    authRouter.route('/signIn')
        .post(passport.authenticate('local', {
            failureRedirect: '/auth',
            successRedirect: '/magasins'
        }), (req, res) => {
            console.log(req.user);
    });

    authRouter.route('/logout')
        .get(logOut);

    return authRouter;
};

module.exports = router;