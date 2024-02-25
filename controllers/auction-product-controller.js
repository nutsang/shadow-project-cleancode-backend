const auctionProductModel = require('../models/auction-product-model')

exports.createAuctionProduct = (request, response) => {
    auctionProductModel.createAuctionProduct(request, response)
}

exports.readAuctionProduct = (request, response) => {
    auctionProductModel.readAuctionProduct(request, response)
}

exports.updateAuctionProduct = (request, response) => {
    auctionProductModel.updateAuctionProduct(request, response)
}

exports.deleteAuctionProduct = (request, response) => {
    auctionProductModel.deleteAuctionProduct(request, response)
}