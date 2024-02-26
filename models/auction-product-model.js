const { isConnected, connection } = require('./connection')
const jsonwebtoken = require('jsonwebtoken')
const SECRET = process.env.SECRET
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const storageAuctionProduct = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/auction-product')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/auction-product', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageAuctionProduct,
    fileFilter: (request, file, callback) => {
        if(file.mimetype === 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.createAuctionProduct = (request, response) => {
    if(!isConnected){
        response.status(200).json({status: false, payload: 'เพิ่มสินค้าประมูลล้มเหลว'})
    }else{
        upload.single('file')(request, response, (error) => {
            if(error){
                response.status(200).json({status: false, payload: 'ใช้ได้แค่ไฟล์ .png เท่านั้น'})
            }else{
                try{
                    // const token = request.cookies.token
                    // jsonwebtoken.verify(token, SECRET)
                    const requestUUID = uuid.v4()
                    const requestProductId = request.body.productId
                    const requestGameName = request.body.gameName
                    const requestName = request.body.name
                    const requestDefaultPrice = request.body.defaultPrice
                    const requestDefaultBit = request.body.defaultBit
                    const requestStartTime = request.body.startTime
                    const requestEndTime = request.body.endTime
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    connection.query('INSERT INTO auction_product (uuid, product_id, game_name, name, default_price, default_bid, auction_status, start_time, end_time, information, description, latest_bidder, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [requestUUID, requestProductId, requestGameName, requestName, requestDefaultPrice, requestDefaultBit, false, requestStartTime, requestEndTime, requestInformation, requestDescription, 'ไร้นาม', new Date(), new Date()], (error, result) => {
                        if(error){
                            fs.unlinkSync(path.join('./public/images/auction-product', request.file.filename))
                            response.status(200).json({status: false, payload: 'เพิ่มสินค้าประมูลล้มเหลว'})
                        }else{
                            response.status(200).json({status: true, payload: 'เพิ่มสินค้าประมูลสำเร็จ'})
                        }
                    })
                }catch(error){
                    try {
                        fs.unlinkSync(path.join('./public/images/auction-product', request.file.filename))
                        response.status(200).json({status: false, payload: 'เพิ่มสินค้าประมูลล้มเหลว'})
                    } catch (error) {
                        response.status(200).json({status: false, payload: 'เพิ่มสินค้าประมูลล้มเหลว'})
                    }
                }
            }
        })
    }
}

module.exports.readAuctionProduct = (request, response) => {
    connection.query('SELECT uuid, game_name , name , default_price , auction_status , information , description FROM auction_product', [], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: [] })
        } else {
            response.status(200).json({ status: true, payload: result })
        }
    })
}

module.exports.updateAuctionProduct = (request, response) => {
    const requestUUID = request.body.uuid
    const requestName = request.body.name
    const requestGameName = request.body.game_name
    const requestDefaultPrice = request.body.default_price
    const requestDefaultBid = request.body.default_bid
    const requestStartTime = request.body.start_time
    const requestEndTime = request.body.end_time
    const requestInformation = request.body.information
    const requestDescription = request.body.description
    connection.query('UPDATE auction_product SET name = ? , game_name = ? , default_price = ? , default_bid = ?, start_time = ?, end_time = ? , information = ? , description = ? , update_at = ? WHERE uuid = ? LIMIT 1', 
        [requestName, requestGameName, requestDefaultPrice, requestDefaultBid, requestStartTime, requestEndTime, requestInformation, requestDescription,new Date(), requestUUID], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: '' })
        } else {
            response.status(200).json({ status: true, payload: 'แก้ไขสำเร็จ' })
        }
    })
}

module.exports.deleteAuctionProduct = (request, response) => {
    const requestUUID = request.body.uuid
    connection.query('DELETE FROM auction_product WHERE uuid = ?', [requestUUID], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: '' })
        } else {
            response.status(200).json({ status: true, payload: 'ลบสำเร็จ' })
        }
    })
}