const express = require('express');
const searchController = require('../search/search.Controller');
const contractsController = require('../contracts/contracts.Controller');
const uploadController = require('../media/controllers/index');
const productsController = require('../products/product.Controller');
const tokensController = require('../tokens/tokens.Controller');
const resalesController = require('../resales/resales.Controller');
const offersController = require('../offers/offers.Controller');

const { JWTVerification } = require('../middleware');
const verifyController = require('../verification/userVerification.controller');

module.exports = () => {
  const router = express.Router();
  router.use('/search', searchController);
  router.use('/contracts', contractsController);
  router.use('/products', productsController);
  router.use('/tokens', JWTVerification, tokensController());
  router.use('/verify', verifyController());
  router.use('/upload', uploadController());

  router.use('/offers', offersController);
  router.use('/resales', resalesController);
  return router;
};
