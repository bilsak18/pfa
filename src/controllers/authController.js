function authController(con, navbar) {

    function signUp(req,res) {
        const user = {
            username: req.body.username1,
            pwd1: req.body.pwd1,
            pwd2: req.body.pwd2
        };
        let sql = `insert into compte(username, pwd) values ("${user.username}", "${user.pwd1}")`;
        if(user.pwd1 === user.pwd2) {
            let usernameCheck = `SELECT username FROM compte WHERE username = "${user.username}"`;
            con.query(usernameCheck, (err, results) => {
                if(!err) {
                    if (results.length===0) {
                        con.query(sql, (err2, results2) => {
                            if (!err2) {
                                let userQuery = `select * from compte where id_compte = ${results2.insertId}`;
                                con.query(userQuery, (err3, results3) => {
                                    req.login(results3, () => {
                                        res.redirect('/');
                                    });
                                });
                            }
                        });
                    } else {
                        res.redirect('/auth');
                    }
                }
            });
        }
    }

    function logOut(req,res) {
        req.logout();
        res.redirect('/auth');
    }
    
    function middleware(req,res,next) {
        if(!req.user) {
            res.redirect('/auth');
        } else {
            next();
        }
    }

    return {
        signUp,
        logOut,
        middleware
    };
}

module.exports = authController;