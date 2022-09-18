const HOST = '62.113.97.215'
const PORT = 80

const express = require('express')
const fs = require('fs')
const urlencodedParser = express.urlencoded({extended: false})
const app = express()
app.use(express.static('.'))
app.use(express.urlencoded({extended: true}))

app.get('*', (req, res) => {
    fs.readFile('./index.html', 'utf8', (err, data) => {
        if (err) throw err
        res.send(data)
    })
})

app.listen(PORT, HOST, () => {
    console.log(`Listening to ${HOST}:${PORT}`)
})