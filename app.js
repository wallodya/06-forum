import express from 'express'
import fs from 'fs'
import pg from 'pg'
import path from 'path'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import apiRouter from './routes/api.js'

const { Pool } = pg
dotenv.config()

const __dirname = path.resolve()

const HOST = process.env.HOST
const PORT = process.env.PORT

const app = express()
const urlencodedParser = express.urlencoded({extended: false})
app.use(express.static('./build'))
app.use(cors({
    origin: "*"
}))
app.use('/avatar', express.static('./images/avatars'))
app.use('/post', express.static('./images/posts'))

app.use(fileUpload())
app.use(bodyParser.json())
// app.use(cookieParser())

// Routes
app.use('/api', apiRouter)

const pool = new Pool({
    user: 'root',
    password: '1234',
    database: 'root',
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
})
  
// Main get request
app.get('*', (req, res) => {
      fs.readFile('./build/index.html', 'utf8', (err, data) => {
          if (err) throw err
          res.send(data)
      })
})

app.listen(PORT, HOST, () => console.log('App listens'))