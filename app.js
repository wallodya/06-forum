import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import fs from 'fs'

const HOST = process.env.VITE_HOST
const PORT = process.env.PORT_HTTP

const app = express()
const urlencodedParser = express.urlencoded({extended: false})
app.use(express.static('./dist'))
app.use(express.urlencoded({extended: true}))


app.get('*', (req, res) => {
    fs.readFile('./dist/index.html', 'utf8', (err, data) => {
        if (err) throw err
        res.send(data)
    })
})


app.listen(PORT, HOST, () => {
    console.log(`Listening to ${HOST}:${PORT}`)
})