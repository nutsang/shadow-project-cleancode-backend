const { isConnected, connection } = require('./connection')
const jsonwebtoken = require('jsonwebtoken')
const SECRET = process.env.SECRET
const multer = require('multer')
const uuid = require('uuid')
const path = require('path')
const fs = require('fs')
const storageGachaProduct = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, './public/images/gacha-product')
    },
    filename: (request, file, callback) => {
        const fileExtension = file.originalname.split('.')[1]
        const fileName = `${uuid.v4()}${Date.now()}${Math.round(Math.random() * 1E9)}.${fileExtension}`
        callback(null, fileName)
        request.on('aborted', () => {
            const fullPath = path.join('./public/images/gacha-product', fileName)
            fs.unlinkSync(fullPath)
        })
    }
})

const upload = multer({
    storage: storageGachaProduct,
    fileFilter: (request, file, callback) => {
        if(file.mimetype === 'image/png'){
            callback(null, true)
        }else{
            callback(new Error('ใช้ได้แค่ไฟล์ .png เท่านั้น'), false)
        }
    }
})

module.exports.createGachaProduct = (request, response) => {
    if(!isConnected){
        response.status(200).json({status: false, payload: 'เพิ่มสินค้ากาชาล้มเหลว'})
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
                    const requestChance = request.body.chance
                    const requestGuaranteeStatus = request.body.guaranteeStatus
                    const requestInformation = request.file.filename
                    const requestDescription = request.body.description
                    connection.query('INSERT INTO gacha_product (uuid, product_id, game_name, name, chance, guarantee_status, information, description, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [requestUUID, requestProductId, requestGameName, requestName, requestChance, requestGuaranteeStatus, requestInformation, requestDescription, new Date(), new Date()], (error, result) => {
                        if(error){
                            fs.unlinkSync(path.join('./public/images/gacha-product', request.file.filename))
                            response.status(200).json({status: false, payload: 'เพิ่มสินค้ากาชาล้มเหลว'})
                        }else{
                            response.status(200).json({status: true, payload: 'เพิ่มสินค้ากาชาสำเร็จ'})
                        }
                    })
                }catch(error){
                    try {
                        fs.unlinkSync(path.join('./public/images/gacha-product', request.file.filename))
                        response.status(200).json({status: false, payload: 'เพิ่มสินค้ากาชาล้มเหลว'})
                    } catch (error) {
                        response.status(200).json({status: false, payload: 'เพิ่มสินค้ากาชาล้มเหลว'})
                    }
                }
            }
        })
    }
}

module.exports.readGachaProduct = (request, response) => {
    connection.query('SELECT uuid, game_name , name , chance, guarantee_status, information , description FROM gacha_product', [], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: [] })
        } else {
            response.status(200).json({ status: true, payload: result })
        }
    })
}

module.exports.updateGachaProduct = (request, response) => {
    const requestUUID = request.body.uuid
    const requestName = request.body.name
    const requestGameName = request.body.game_name
    const requestChance = request.body.chance
    const requestGuarantee = request.body.guarantee_status
    const requestInformation = request.body.information
    const requestDescription = request.body.description
    connection.query('UPDATE gacha_product SET name = ? , game_name = ? , chance = ? , guarantee_status = ? , information = ? , description = ? , update_at = ? WHERE uuid = ? LIMIT 1', 
        [requestName, requestGameName, requestChance, requestGuarantee, requestInformation, requestDescription, new Date(), requestUUID], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: '' })
        } else {
            response.status(200).json({ status: true, payload: 'แก้ไขสำเร็จ' })
        }
    })
}

module.exports.deleteGachaProduct = (request, response) => {
    const requestUUID = request.body.uuid
    connection.query('DELETE FROM gacha_product WHERE uuid = ?', [requestUUID], (error, result) => {
        if (error) {
            response.status(200).json({ status: false, payload: '' })
        } else {
            response.status(200).json({ status: true, payload: 'ลบสำเร็จ' })
        }
    })
}