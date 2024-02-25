const cookieParser = require('cookie-parser')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const app = express()
dotenv.config({ path: path.join(__dirname, 'server.env') })
const options = {
    'origin': [process.env.CLIENT],
    'credentials': true,
}
const accountRoute = require('./routes/account-route')
const gameNameRoute = require('./routes/game-name-route')
const bannerRoute = require('./routes/banner-route')
const generalProductRoute = require('./routes/general-product-route')
const auctionProductRoute = require('./routes/auction-product-route')
const gachaProductRoute = require('./routes/gacha-product-route')

app.use(cookieParser())
app.use(express.json())
app.use(cors(options))
app.use(morgan('dev'))
app.use('/public/images/avatar', express.static(path.join(__dirname, '/public/images/avatar')))
app.use('/public/images/banner', express.static(path.join(__dirname, '/public/images/banner')))
app.use('/public/images/general-product', express.static(path.join(__dirname, '/public/images/general-product')))
app.use('/public/images/auction-product', express.static(path.join(__dirname, '/public/images/auction-product')))
app.use('/public/images/gacha-product', express.static(path.join(__dirname, '/public/images/gacha-product')))
app.use('/public/images/payment-method', express.static(path.join(__dirname, '/public/images/payment-method')))
app.use('/public/images/topup', express.static(path.join(__dirname, '/public/images/topup')))
app.use('/api', accountRoute)
app.use('/api', gameNameRoute)
app.use('/api', bannerRoute)
app.use('/api', generalProductRoute)
app.use('/api', auctionProductRoute)
app.use('/api', gachaProductRoute)

const port = process.env.PORT || 8000
const server = app.listen(port, () => {
    console.log(`เปิดเซิร์ฟเวอร์ด้วยพอร์ต ${port} สำเร็จ`)
    console.log(`ที่อยู่เซิร์ฟเวอร์ http://localhost:${port}/`)
})
server.on('error', (error) => {
    console.error(`เปิดเซิร์ฟเวอร์ด้วยพอร์ต ${error.address} ล้มเหลว`)
    server.close(() => {
        console.error('เซิร์ฟเวอร์ปิดตัวลงเรียบร้อย')
    })
})