function magasinsController(con, navbar) {

    function getProd(req,res) {
        const idMag = req.params.id;
        let sql = `SELECT ref_produit, description, image, prix FROM produit WHERE id_boutique = ${idMag}`;
        if(req.user) {
            sql = `SELECT produit.ref_produit, description, image, prix FROM produit WHERE id_boutique = ${idMag} AND produit.ref_produit NOT IN (select ref_produit from panier where panier.id_compte = ${req.user.id_compte})`;
        }
        con.query(sql, (err2, result2) => {
            if(err2)
                throw err2;
            else {
                let buffer64 = new ArrayBuffer(64);
                let i=0;
                let qte = new Array(0);
                result2.forEach(val => {
                    buffer64[i] = new Buffer(val.image).toString("base64");
                    val.image = buffer64[i];
                    const selectQte = `select quantite from produit where ref_produit = ${val.ref_produit}`;
                    con.query(selectQte, (err2, quantity) => {
                        if(err2)
                            throw err2;
                        else {
                            qte.push(quantity[0].quantite);
                            i++;
                            if(i===result2.length){
                                res.render('products', {
                                    nav: navbar,
                                    products: result2,
                                    req: req,
                                    qte: qte
                                });
                            }
                        }
                    });
                });
            }
        });
    }

    function deletePanier(req,res) {
        const selectQte = `select qte_produit from panier where id_compte = ${req.user.id_compte} and ref_produit = ${req.body.productId}`;
        const deleteProduct = `delete from panier where panier.ref_produit = ${req.body.productId} and panier.id_compte = ${req.user.id_compte}`;
        con.query(selectQte, (err2,qte) => {
            if(err2)
                throw err2;
            else {
                const updateQte = `update produit set quantite = quantite + ${qte[0].qte_produit} where ref_produit = ${req.body.productId}`;
                con.query(updateQte, (err3) => {
                    if(err3)
                        throw err3;
                    else
                    {
                        con.query(deleteProduct, (err) => {
                            if (err)
                                throw err;
                            else {
                                res.redirect(`${req.body.magasinId}`);
                            }
                        });
                    }
                });
            }
        });

    }
    
    function middleware(req,res,next) {
        if(!req.user) {
            res.redirect('/magasins');
        } else {
            next();
        }
    }

    return {
        getProd,
        deletePanier,
        middleware
    }
}

module.exports = magasinsController;