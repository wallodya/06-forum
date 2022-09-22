import express from 'express'
import fs from 'fs'
import { Server } from "socket.io"
import * as dotenv from 'dotenv'
dotenv.config()

const HOST = process.env.VITE_HOST
const PORT = process.env.PORT_HTTP
const PORT_SOCKET = process.env.VITE_PORT_SOCKET
const app = express()
const urlencodedParser = express.urlencoded({extended: false})
app.use(express.static('./dist'))
app.use(express.urlencoded({extended: true}))
const io = new Server({
    cors : {
        origin: '*'
    }
})

app.get('*', (req, res) => {
    fs.readFile('./dist/index.html', 'utf8', (err, data) => {
        if (err) throw err
        res.send(data)
    })
})

io.on('connection', (socket) => {
    // console.log('User connected, socket id: ', socket.id)

    socket.on('logoutReq', (userId) => {
        console.log(`User ${userId} logged out`)
        socket.emit('logoutRes', userId)
    })

    socket.on('loginSubmit', (data) => {
        console.log(
            `User tries to loggin\n
            Login: ${data.login}\n
            Password: ${data.password}`
        )
        // User authentification
        socket.emit('loginSuccess')
    })

    socket.on('createAccount', (data) => {
        console.log(
            `New account created:\n
            Login: ${data.login}\n
            Name: ${data.email}\n
            E-mail: ${data.email}\n
            Password: ${data.password}`
        )
        // Adding new user to DB, gives user unique ID
        const newUserId = "010203"

        socket.emit('accountCreated', newUserId)
        })

    socket.on('getOnlineStatus', (userId) => {
        // console.log('got status request from ', userId)

        // For testing: generating and sending random interval between 0 minutes and 7 days
        const msInHour = 1000 * 60 * 60
        const lastSeenTime = Date.now() - Math.floor(Math.random() * msInHour * 24 * 7) + 1

        socket.emit(`setOnlineStatusFor${userId}`, lastSeenTime)
    })

    socket.on('getUsersData', (_userIds) => {
        switch (true) {
            case _userIds === 'all' : {
                console.log('Request for every users data')
                const data = DB_TEST
                socket.emit(`sendUsersDataFor${_userIds}`, data)
                break
            }
            case !Array.isArray(_userIds) : {
                console.log(`Request data for one user: ${_userIds}`)
                const data = DB_TEST[_userIds]
                socket.emit(`sendUsersDataFor${_userIds}`, data)
                break
            }
            case Array.isArray(_userIds) : {
                console.log(`Request for data of following users: ${_userIds}`)
                const data = {}
                for (let userId of _userIds) {
                    data[userId] = DB_TEST[userId]
                }
                socket.emit(`sendUsersDataFor${_userIds}`, data)
            }
        }
    })

    socket.on(`changeProfileData`, (newData) => {
        console.log(`${DB_TEST[newData.userId].userName} changed profile data:
                    New login: ${newData.newLogin}
                    New e-mail: ${newData.newEmail}`)
        socket.emit(`profileDataChangedForUser${newData.userId}`, 'Your data changned!!!')
    })

})



app.listen(PORT, HOST, () => {
    console.log(`Listening to ${HOST}:${PORT}`)
})

io.listen(process.env.VITE_PORT_SOCKET, () => {
    console.log(`Socket listens to ${HOST}:${PORT_SOCKET}`)
})



const DB_TEST = { 
    '000001':
   { userName: 'wallodya',
     name: 'Vladimir',
     email: 'qwerty@test.com',
     isAdmin: true,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000002', '000003', '000004', '000005' ],
     isBanned: false },
  '000002':
   { userName: 'user123',
     name: 'John',
     email: 'abc@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000001', '000003', '000004', '000005' ],
     isBanned: false },
  '000003':
   { userName: '_ivan_',
     name: 'Иван Иванов',
     email: 'ivan4321@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000001', '000002', '000004', '000005' ],
     isBanned: false },
  '000004':
   { userName: 'random_user',
     name: 'John Smith',
     email: 'qwerty@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000001', '000002', '000003', '000005' ],
     isBanned: false },
  '000005':
   { userName: 'Dude',
     name: 'Имя Фамилия',
     email: 'qwerty@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000001', '000002', '000003', '000004' ],
     isBanned: false },
  '000006':
   { userName: '_000006_',
     name: '000006\'s name',
     email: '917@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000005', '000004', '000003', '000002', '000001' ],
     isBanned: true },
  '000007':
   { userName: '_000007_',
     name: '000007\'s name',
     email: '363@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000006', '000005', '000004', '000003', '000002' ],
     isBanned: true },
  '000008':
   { userName: '_000008_',
     name: '000008\'s name',
     email: '955@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000007', '000006', '000005', '000004', '000003' ],
     isBanned: true },
  '000009':
   { userName: '_000009_',
     name: '000009\'s name',
     email: '329@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000008', '000007', '000006', '000005', '000004' ],
     isBanned: true },
  '000010':
   { userName: '_000010_',
     name: '000010\'s name',
     email: '212@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000009', '000008', '000007', '000006', '000005' ],
     isBanned: true },
  '000011':
   { userName: '_000011_',
     name: '000011\'s name',
     email: '660@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000010', '000009', '000008', '000007', '000006' ],
     isBanned: true },
  '000012':
   { userName: '_000012_',
     name: '000012\'s name',
     email: '262@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000011', '000010', '000009', '000008', '000007' ],
     isBanned: true },
  '000013':
   { userName: '_000013_',
     name: '000013\'s name',
     email: '563@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000012', '000011', '000010', '000009', '000008' ],
     isBanned: true },
  '000014':
   { userName: '_000014_',
     name: '000014\'s name',
     email: '967@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000013', '000012', '000011', '000010', '000009' ],
     isBanned: true },
  '000015':
   { userName: '_000015_',
     name: '000015\'s name',
     email: '875@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000014', '000013', '000012', '000011', '000010' ],
     isBanned: true },
  '000016':
   { userName: '_000016_',
     name: '000016\'s name',
     email: '192@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000015', '000014', '000013', '000012', '000011' ],
     isBanned: true },
  '000017':
   { userName: '_000017_',
     name: '000017\'s name',
     email: '420@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000016', '000015', '000014', '000013', '000012' ],
     isBanned: true },
  '000018':
   { userName: '_000018_',
     name: '000018\'s name',
     email: '317@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000017', '000016', '000015', '000014', '000013' ],
     isBanned: true },
  '000019':
   { userName: '_000019_',
     name: '000019\'s name',
     email: '132@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000018', '000017', '000016', '000015', '000014' ],
     isBanned: true },
  '000020':
   { userName: '_000020_',
     name: '000020\'s name',
     email: '568@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000019', '000018', '000017', '000016', '000015' ],
     isBanned: true },
  '000021':
   { userName: '_000021_',
     name: '000021\'s name',
     email: '474@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000020', '000019', '000018', '000017', '000016' ],
     isBanned: true },
  '000022':
   { userName: '_000022_',
     name: '000022\'s name',
     email: '836@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000021', '000020', '000019', '000018', '000017' ],
     isBanned: true },
  '000023':
   { userName: '_000023_',
     name: '000023\'s name',
     email: '732@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000022', '000021', '000020', '000019', '000018' ],
     isBanned: true },
  '000024':
   { userName: '_000024_',
     name: '000024\'s name',
     email: '886@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000023', '000022', '000021', '000020', '000019' ],
     isBanned: true },
  '000025':
   { userName: '_000025_',
     name: '000025\'s name',
     email: '470@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000024', '000023', '000022', '000021', '000020' ],
     isBanned: true },
  '000026':
   { userName: '_000026_',
     name: '000026\'s name',
     email: '102@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000025', '000024', '000023', '000022', '000021' ],
     isBanned: true },
  '000027':
   { userName: '_000027_',
     name: '000027\'s name',
     email: '580@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000026', '000025', '000024', '000023', '000022' ],
     isBanned: true },
  '000028':
   { userName: '_000028_',
     name: '000028\'s name',
     email: '919@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000027', '000026', '000025', '000024', '000023' ],
     isBanned: true },
  '000029':
   { userName: '_000029_',
     name: '000029\'s name',
     email: '991@test.com',
     isAdmin: false,
     avatarLink: '../lib/img/default_prof_pic.png',
     friendList: [ '000028', '000027', '000026', '000025', '000024' ],
     isBanned: true } 
}
 
