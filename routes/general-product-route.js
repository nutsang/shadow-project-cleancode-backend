const express = require('express')
const router = express.Router()
const {createGeneralProduct, readGeneralProduct, updateGeneralProduct, deleteGeneralProduct} = require('../controllers/general-product-controller')

router.post('/create-general-product', createGeneralProduct)
router.get('/read-general-product', readGeneralProduct)
router.patch('/update-general-product', updateGeneralProduct)
router.delete('/delete-general-product', deleteGeneralProduct)

module.exports = router