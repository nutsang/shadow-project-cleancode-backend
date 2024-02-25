const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : process.env.HOST,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
})

let isConnected = true
connection.connect((error) => {
    if(error){
        console.error(`การเชื่อมต่อล้มเหลวเนื่องจาก ${error.message}`)
        connection.end(() => {
            console.error('ยุติการเชื่อมต่อ')
        })
    }else{
        console.log('การเชื่อมต่อสำเร็จ')
    }
})

module.exports = { connection, isConnected }