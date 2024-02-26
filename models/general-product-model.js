const { isConnected, connection } = require('./connection')
const jsonwebtoken = require('jsonwebtoken')
const SECRET = process.env.SECRET
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const storageGeneralProduct = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/general-product')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/general-product', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageGeneralProduct,
    fileFilter: (request, file, callback) => {
        if(file.mimetype === 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.createGeneralProduct = (request, response) => {
    if(!isConnected){
        response.status(200).json({status: false, payload: 'เพิ่มสินค้าล้มเหลว'})
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
                    const requestNormalPrice = request.body.normalPrice
                    const requestSpecialPrice = request.body.specialPrice
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    connection.query('INSERT INTO general_product (uuid, product_id, game_name, name, normal_price, special_price, special_price_status, information, description, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [requestUUID, requestProductId, requestGameName, requestName, requestNormalPrice, requestSpecialPrice, false, requestInformation, requestDescription, new Date(), new Date()], (error, result) => {
                        if(error){
                            fs.unlinkSync(path.join('./public/images/general-product', request.file.filename))
                            response.status(200).json({status: false, payload: 'เพิ่มสินค้าล้มเหลว'})
                        }else{
                            response.status(200).json({status: true, payload: 'เพิ่มสินค้าสำเร็จ'})
                        }
                    })
                }catch(error){
                    try {
                        fs.unlinkSync(path.join('./public/images/general-product', request.file.filename))
                        response.status(200).json({status: false, payload: 'เพิ่มสินค้าล้มเหลว'})
                    } catch (error) {
                        response.status(200).json({status: false, payload: 'เพิ่มสินค้าล้มเหลว'})
                    }
                }
            }
        })
    }
}

module.exports.readGeneralProduct = (request, response) => {
    connection.query('SELECT uuid, name , game_name , normal_price , special_price , special_price_status , information , description FROM general_product', [], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: [] })
        } else {
            response.status(200).json({ status: true, payload: result })
        }
    })
}

module.exports.updateGeneralProduct = (request, response) => {
    const requestUUID = request.body.uuid
    const requestName = request.body.name
    const requestGameName = request.body.game_name
    const requestNormalPrice = request.body.normal_price
    const requestSpecialPrice = request.body.special_price
    const requestInformation = request.body.information
    const requestDescription = request.body.description
    connection.query('UPDATE general_product SET name = ? , game_name = ? , normal_price = ? , special_price = ? , information = ? , description = ? , update_at = ? WHERE uuid = ? LIMIT 1', 
        [requestName, requestGameName, requestNormalPrice, requestSpecialPrice, requestInformation, requestDescription, new Date(), requestUUID], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: '' })
        } else {
            response.status(200).json({ status: true, payload: 'แก้ไขสำเร็จ' })
        }
    })
}

module.exports.deleteGeneralProduct = (request, response) => {
    const requestUUID = request.body.uuid
    connection.query('DELETE FROM general_product WHERE uuid = ?', [requestUUID], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: '' })
        } else {
            response.status(200).json({ status: true, payload: 'ลบสำเร็จ' })
        }
    })
}