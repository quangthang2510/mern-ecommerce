const express = require('express');
const { getAllProduct, createProduct, updateProduct, deleteProduct, productDetail } = require('../controllers/productController');
const {isAuthenticatedUser, authorizeRoles} = require('../middlewear/Auth')
const router = express.Router();
router.route('/product/new').post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)
router.route('/products').get(getAllProduct)
router.route('/product/:id').put(updateProduct)
router.route('/product/:id').delete(deleteProduct)
router.route('/product/:id').get(productDetail)
module.exports = router;