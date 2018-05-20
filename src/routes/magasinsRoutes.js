const express = require('express');
const magasinsRouter = express.Router();

const magasinsController = require('../controllers/magasinsController');

const router = (con, navbar) => {

    const { getProd, deletePanier, middleware } = magasinsController(con,navbar);

    magasinsRouter.route('/:id')
        .post(deletePanier)
        .get(getProd);


    return magasinsRouter;
};

module.exports = router;