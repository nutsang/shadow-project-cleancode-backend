const { isConnected, connection } = require('./connection')
const uuid = require('uuid')
const twApi = require('@opecgame/twapi')

module.exports.topUp = (request, response) => {
    const requestEmail = request.body.email
    const requestGiftTrueMoney = request.body.giftTrueMoney
    if(!isConnected){
        response.status(200).json({status: false, payload: 'เติม Aysel ล้มเหลว'})
    }else{
        const getWallet = async() => {
            const tw = await twApi(requestGiftTrueMoney, process.env.PHONEVOUCHER)
            if(tw.status.code == 'SUCCESS'){
                const baht = tw.data.my_ticket.amount_baht
                connection.query('UPDATE finance SET cash_amount = cash_amount + ?, aysel_amount = aysel_amount + ?, update_at = ? WHERE email = ?', [baht, baht*process.env.AYSEL, new Date(), requestEmail], (error, result) => {
                    if(error){
                        response.status(200).json({status: false, payload: 'เติม Aysel ล้มเหลว'})
                    }else{
                        connection.query('INSERT INTO history_payment (uuid, email, aysel_amount, cash_amount, payment_status, create_at, update_at) VALUES (?, ?, ?, ?, ?, ?, ?)', [uuid.v4(), requestEmail, baht*process.env.AYSEL, baht, true, new Date(), new Date()], (error, result) => {
                            if(error){
                                response.status(200).json({status: false, payload: 'เติม Aysel ล้มเหลว'})
                            }else{
                                response.status(200).json({status: true, payload: 'เติม Aysel สำเร็จ'})
                            }
                        })
                    }
                })
            }else{
                response.status(200).json({status: false, payload: 'เติม Aysel ล้มเหลว'})
            }
        }
        getWallet()
    }
}