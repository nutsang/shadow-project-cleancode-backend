const express = require('express')
const router = express.Router()
const { paymentMethodSelect, paymentMethodUpdateImage, paymentMethodUpdateVideo} = require('../controllers/payment-method-controller')

router.get('/payment-method-select', paymentMethodSelect)
router.patch('/payment-method-update-image', paymentMethodUpdateImage)
router.patch('/payment-method-update-video', paymentMethodUpdateVideo)

module.exports = router