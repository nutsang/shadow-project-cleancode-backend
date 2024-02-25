const express = require('express')
const router = express.Router()
const { validationAccount, signUpAccount, signInAccount, signOutAccount, authenticationAccount } = require('../controllers/account-controller')

router.post('/sign-up-validation', validationAccount)
router.post('/sign-up-account', signUpAccount)
router.post('/sign-in-account', signInAccount)
router.get('/sign-out-account', signOutAccount)
router.get('/authentication-account', authenticationAccount)

module.exports = router