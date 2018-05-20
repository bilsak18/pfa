function indexController(con, navbar) {

    function getAuth(req, res) {
        res.render('authentification', {
            nav: navbar,
            req: req
        });
    }

    function getMag(req, res) {
        let sql = 'SELECT id_boutique id, name_boutique name, image_boutique image, description FROM boutique';
        con.query(sql, (err, result) => {
            if (err)
                throw err;
            else {
                let buffer64 = new ArrayBuffer(64);
                let i = 0;
                result.forEach(val => {
                    buffer64[i] = new Buffer(val.image).toString("base64");
                    val.image = buffer64[i];
                    i++;
                });
                res.render('elements', {
                    nav: navbar,
                    boutiques: result,
                    req: req
                });
            }
        });
    }

    function createPanier(req, res) {
        const insertProduct = `insert into panier (id_compte, ref_produit, qte_produit) values (${req.user.id_compte}, ${req.body.productId}, ${req.body.qte})`;
        const updateQte = `update produit set quantite = quantite - ${req.body.qte} where ref_produit = ${req.body.productId}`;
        con.query(insertProduct, (err) => {
            if (err)
                throw err;
            else {
                con.query(updateQte, (err3) => {
                    if(err3)
                        throw err3;
                    else
                        res.redirect('/panier');
                })
            }
        });
    }

    function getPanier(req, res) {
        const selectPanier = `select produit.id_boutique, panier.ref_produit, qte_produit, prix, description, image from panier, compte, produit where compte.id_compte = ${req.user.id_compte} and panier.id_compte = compte.id_compte and produit.ref_produit = panier.ref_produit`;
        con.query(selectPanier, (err,result) => {
            if(err)
                throw err;
            else {
                let buffer64 = new ArrayBuffer(64);
                let i=0;
                result.forEach(val => {
                    buffer64[i] = new Buffer(val.image).toString("base64");
                    val.image = buffer64[i];
                    i++;
                });
                res.render('panier', {
                    nav: navbar,
                    panier: result,
                    req: req
                });
            }
        });
    }

    function middlewareAuth(req, res, next) {
        if (req.user) {
            res.redirect('/');
        } else {
            next();
        }
    }

    function middlewarePanier(req, res, next) {
        if (!req.user) {
            res.redirect('/');
        } else {
            next();
        }
    }

    return {
        getAuth,
        getMag,
        createPanier,
        getPanier,
        middlewareAuth,
        middlewarePanier
    };
}

module.exports = indexController;