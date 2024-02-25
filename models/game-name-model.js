const { isConnected, connection } = require('./connection')
const uuid = require('uuid')

module.exports.gameNameInsert = (request, response) => {
    const requestUUID = uuid.v4()
    const requestGameName = request.body.gameName
    if(!isConnected){
        response.status(200).json({status: false, payload: 'เพิ่มชื่อเกมล้มเหลว'})
    }else{
        connection.query('INSERT INTO game_name (uuid, game_name) VALUES (?, ?)', [requestUUID, requestGameName], (error, result) => {
            if(error){
                if(error.code === 'ER_DUP_ENTRY'){
                    response.status(200).json({status: false, payload: `มีชื่อเกม ${requestGameName} ในระบบแล้ว`})
                }else{
                    response.status(200).json({status: false, payload: `เพิ่มเกมชื่อ ${requestGameName} ล้มเหลว`})
                }
            }else{
                response.status(200).json({status: true, payload: `เพิ่มเกมชื่อ ${requestGameName} สำเร็จ`})
            }
        })
    }
}

module.exports.gameNameSelect = (request, response) => {
    if(!isConnected){
        response.status(200).json({status: false, payload: 'แสดงชื่อเกมล้มเหลว'})
    }else{
        connection.query('SELECT uuid, game_name, create_at, update_at from game_name', [], (error, result) => {
            if(error){
                response.status(200).json({status: false, payload: 'แสดงชื่อเกมล้มเหลว'})
            }else{
                response.status(200).json({status: true, payload: result})
            }
        })
    }
}

module.exports.gameNameUpdate = (request, response) => {
    const requestUUID = request.body.uuid
    const requestGameName = request.body.game_name
    connection.query('UPDATE game_name SET game_name = ?, update_at = ? WHERE uuid = ?', [requestGameName, new Date(), requestUUID], (error, result) => {
        if(error){
            response.status(200).json({status: false, payload: error})
        }else{
            response.status(200).json({status: true, payload: result})
        }
    })
}

module.exports.gameNameDelete = (request, response) => {
    const requestUUID = request.params.uuid
    connection.query('DELETE FROM game_name WHERE uuid = ?', [requestUUID], (error, result) => {
        if(error){
            response.status(200).json({status: false, payload: error})
        }else{
            response.status(200).json({status: true, payload: result})
        }
    })
}