const gachaProductModel = require('../models/gacha-product-model')

exports.createGachaProduct = (request, response) => {
    gachaProductModel.createGachaProduct(request, response)
}

exports.readGachaProduct = (request, response) => {
    gachaProductModel.readGachaProduct(request, response)
}

exports.updateGachaProduct = (request, response) => {
    gachaProductModel.updateGachaProduct(request, response)
}

exports.deleteGachaProduct = (request, response) => {
    gachaProductModel.deleteGachaProduct(request, response)
}