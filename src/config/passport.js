const passport = require('passport');

module.exports = (con, app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    // Stores user in session
    passport.serializeUser((user,done) => {
        done(null, user);
    });

    // Retrieves user from session
    passport.deserializeUser((user,done) => {
        done(null, user);
    });

    require('./strategies/local.strategy')(con, passport);
};