const express = require('express');
const indexRouter = express.Router();
const passport = require('passport');

const indexController = require('../controllers/indexController');

const router = (con, navbar) => {

    const { getAuth, getMag, createPanier, getPanier, middlewareAuth, middlewarePanier } = indexController(con,navbar);

    indexRouter.route('/auth')
        .all(middlewareAuth)
        .get(getAuth);

    indexRouter.route('/magasins')
        .get(getMag);

    indexRouter.route('/panier')
        .all(middlewarePanier)
        .post(createPanier)
        .get(getPanier);

    return indexRouter;
};

module.exports = router;