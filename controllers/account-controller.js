const accountModel = require('../models/account-model')

exports.validationAccount = (request, response) => {
    accountModel.validationAccount(request, response)
}

exports.signUpAccount = (request, response) => {
    accountModel.signUpAccount(request, response)
}

exports.signInAccount = (request, response) => {
    accountModel.signInAccount(request, response)
}

exports.signOutAccount = (request, response) => {
    accountModel.signOutAccount(request, response)
}

exports.authenticationAccount = (request, response) => {
    accountModel.authenticationAccount(request, response)
}

exports.selectAccount = (request, response) => {
    accountModel.selectAccount(request, response)
}