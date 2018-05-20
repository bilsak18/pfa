const { Strategy } = require('passport-local');

module.exports = function localStrategy(con, passport) {
    passport.use(new Strategy(
        {
            idField: 'id_compte',
            usernameField: 'username',
            passwordField: 'pwd',
        }, (username, pwd, done) => {
            let sql = `select id_compte, username, pwd from compte where username = '${username}'`;
            con.query(sql, (err,results) => {
                if(results.length !== 0) {
                    if(pwd === results[0].pwd) {
                        const user = results[0];
                        done(null,user);
                    } else {
                        done(null,false);
                    }
                } else {
                    done(null,false);
                }
            });
        }));
};