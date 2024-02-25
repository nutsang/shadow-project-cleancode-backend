const express = require('express')
const router = express.Router()
const {createGachaProduct, readGachaProduct, updateGachaProduct, deleteGachaProduct} = require('../controllers/gacha-product-controller')

router.post('/create-gacha-product', createGachaProduct)
router.get('/read-gacha-product', readGachaProduct)
router.patch('/update-gacha-product', updateGachaProduct)
router.delete('/delete-gacha-product', deleteGachaProduct)

module.exports = router