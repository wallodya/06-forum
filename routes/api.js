import express from 'express'
import pg from 'pg'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()

const { Pool } = pg
const pool = new Pool({
    user: 'root',
    password: '1234',
    database: 'root',
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
})

const api = express.Router()

api.route('/posts')
    .post((req, res) => {
        pool.query({
            text: `SELECT post.id AS id, author_id, user_login, is_admin, post_text, post_image, time_posted
                        FROM post
                        INNER JOIN
                        users ON(post.author_id = users.id)
                        WHERE owner_id = $1
                        ORDER BY time_posted DESC`,
            values: [req.body.id]
        })
            .then(data => {
                res.json(data.rows)
            })
            .catch(err => console.log('Error in getPostsForUser: ', err))
    })

api.put('/post/loadImage', (req, res) => {
    const { postImage } = req.files
    if (!postImage) {
        console.log('No image')
        return res.sendStatus(400)
    }
    if (!/^image/.test(postImage.mimetype)) {
        console.log('Not an image')
        return res.sendStatus(400)
    }
    postImage.mv(__dirname + '/tmp/' + postImage.name)
    console.log('post image : ', postImage.name)
    res.send(JSON.stringify({key: postImage.name}))
})

api.delete('/post/loadImage', (req, res) => {
    console.log('revert req.body: ', req.method, req.body.id)
    fs.unlink(__dirname + '/tmp/' + req.body.id, err => {
        if (err) console.log('Error while rm tmp post file: ', err)
    })
})

api.delete('/post', (req, res) => {
    const { id } = req.body
    pool.query({
        text: `DELETE FROM post WHERE id = $1`,
        values: [id]
    })
    .then(() => {
        
    })
    .catch(err => {
        console.log('Error while deleting post: ', err)

    })
})

api.post('/post/new', (req, res) => {
    const post = req.body
    console.log('New post: ')
    console.log(post)
    pool.query({
        text: 'SELECT * FROM users WHERE id = $1 AND is_banned = TRUE',
        values: [post.author]
    })
    .then(res => {
        if (res.rowCount) {
            return res.status(403).end()
        }
    })
    .catch(err => {
        console.log('Error while checking whether user is banned: ', err)
        return res.status(500).end()
    })

    pool.query({
        text: `INSERT INTO post(author_id, owner_id, post_text, time_posted)
            VALUES ($1,$2,$3,CURRENT_TIMESTAMP) RETURNING id`,
        values: [post.author, post.owner, post.text]
    })
    .then((postID) => {
        const name = postID.rows[0].id + '_' + post.imageName
        console.log('New post image name: ', name)
        fs.rename(__dirname + '/tmp/' + post.imageName, __dirname + '/images/posts/' + name, err => {
            if (err && err.code === 'ENOENT') {
                pool.query({
                    text: `UPDATE post SET post_image = '../lib/img/default_post.png' WHERE id = $1`,
                    values: [postID.rows[0].id]
                })
                .then(() => {
                    console.log('Default image set')
                    return res.status(200).end()
                })
                .catch(err => {
                    console.log('Error while adding default image address to DB: ', err)
                    return res.status(500).end()
                })
            } else if (err) {
                console.log('Error while moving post image')
                return res.status(500).end()
            }
        })
        const imageAddress = post.imageURL + name
        pool.query({
            text: `UPDATE post SET post_image = $1 WHERE id = $2`,
            values: [imageAddress, postID.rows[0].id]
        })
        .then(() => {
            return res.status(200).end()
        })
        .catch(err => {
            console.log('Error while adding image address to DB: ', err)
            return res.status(500).end()
        })
    })
    .catch(err => {
        console.log('Error while saving new post to DB: ', err)
        return res.status(500).end()
    })
})

api.post('/login', (req, res) => {
    const login = req.body.login
    const password = req.body.password
    pool.query({
        text:
            `
            SELECT id AS uuid,
                user_login AS login,
                user_name AS name,
                email,
                is_banned,
                is_admin,
                avatar 
            FROM "users" 
            WHERE
                user_login = $1 
                AND
                user_password = $2
            `,
        values: [login, password]
    })
        .then(data => {
            res.json(data.rows[0] || null)
        })
        .catch(err => console.log(err))
})

api.route('/user')
    .post((req, res) => {
        const { login } = req.body
        // console.log('Request for user: ', login)s
        pool.query({
            text:
                `
                SELECT 
                    id AS uuid,
                    user_login AS login,
                    user_name AS name,
                    email,
                    is_banned,
                    is_admin,
                    avatar 
                FROM "users" 
                WHERE
                    user_login = $1
                `,
            values: [login]
        })
            .then(data => res.json(data.rowCount ? data.rows[0] : null))
            .catch(err => console.log('Error while gettinng user: ', err))
    })
    .delete((req,res) => {
        const { login } = req.body
        console.log('Deleting user: ', login)
        pool.query({
            text: `INSERT INTO deleted_users(user_id, user_login)
                  VALUES (
                    (SELECT id FROM users WHERE user_login = $1), $1
                  )`,
            values: [login]
        })
        .then(() => {
            console.log('first query done')
            pool.query({
              text: 'DELETE FROM users WHERE user_login = $1',
              values: [login]
            })
        })
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log('Error while deleting user: ', err)
            res.sendStatus(500)
        })
    })
    .put((req, res) => {
        const { newAvatar, newName, newEmail, uuid } = req.body
        console.log('Change data request: ')
        console.log(newAvatar, newName, newEmail)

        if (newAvatar) {
            fs.rename(__dirname + '/tmp/' + newAvatar, __dirname + '/images/avatars/' + newAvatar, err => {
                if(err) {
                    console.log('Error while saving avatar: ', err)
                    res.status(500).end()
                }
            })     
            pool.query({
                text: 'UPDATE users SET avatar = $1 WHERE id = $2',
                values: [`http://${process.env.HOST}/avatar/${newAvatar}`, uuid]
            })
            .catch(err => console.log('Error while saving new avatar to DB', err))
        }

        pool.query({
            text: `UPDATE users
                 SET
                 user_name = $1,
                 email = $2
                 WHERE id = $3`,
            values: [newName, newEmail, uuid]
        })
        .then(() => {
            console.log(`Changed profile data:
            New name: ${newName}
            New e-mail: ${newEmail}`)
            res.status(200).end()
        })
        .catch(err => {
            console.log('Error while changing user data: ', err)
            res.status(500).end()
        })
    })

api.route('/user/avatar')
    .put((req, res) => {
        const { avatar } = req.files
        if (!avatar) return res.sendStatus(400)
        if (!/^image/.test(avatar.mimetype)) return res.sendStatus(400)
        avatar.mv(__dirname + '/tmp/' + avatar.name)
        console.log('image avatar: ', avatar.name)
        res.send(JSON.stringify({key: avatar.name}))
    })
    .delete((req, res) => {
        console.log('revert res.body: ', req.method, req.body.id)
        fs.unlink(__dirname + '/tmp/' + req.body.id, err => {
            if (err) console.log('Error while rm tmp avatar file: ', err)
        })
    })

api.post('/user/ban', (req, res) => {
    const { login } = req.body
    console.log('Ban user: ', login)
    pool.query({
        text: `UPDATE users
              SET is_banned = NOT is_banned
              WHERE user_login = $1`,
        values: [login]
    })
    .then(() => {
        console.log(`user ${login} banned/unbanned `)
        res.sendStatus(200)
    })
    .catch(err => {
        console.log('Error while banning user', err)
        res.sendStatus(500)
    })
})

api.post('/user/online', (req, res) => {
    const { uuid } = req.body
    pool.query({
        text: 'SELECT * FROM user_sessions WHERE user_id = $1',
        values: [uuid]
    })
    .then(data => {
        if (data.rowCount) {
            res.json({online: true})
        } else {
            pool.query({
                text: 'SELECT last_online FROM users WHERE id = $1',
                values: [uuid]
            })
            .then(data => {
                res.json({online: false, lastOnline: data.rows[0].last_online})
            })
            .catch(err => console.log(err))
        }
         
    })
    .catch(err => console.log(`Error in getOnlineStatus: ${err}`))
})

api.post('/users/all', (req, res) => {
    console.log('Got req for all users')
    pool.query('SELECT id AS uuid, user_login AS login, user_name AS name, email, is_banned, is_admin, avatar FROM users')
        .then(data => res.json(data.rows))
        .catch(err => console.log('Error while getting all users: ', err))
})

api.post('/users/deleted', (req, res) => {
    console.log('Got req for deleted users')
    pool.query('SELECT user_login AS login FROM deleted_users')
        .then(data => res.json(data.rows))
        .catch(err => console.log('Error while getting all users: ', err))
})

api.route('/friends')
    .post((req, res) => {
        const login = req.body.login
        pool.query({
            text:
                `
                    SELECT
                    id AS uuid,
                    user_login AS login,
                    avatar,
                    is_banned
                    FROM users
                    WHERE id IN
                        (
                            SELECT
                            CASE
                                WHEN first_friend<>(SELECT id FROM users WHERE user_login=$1)
                                    THEN first_friend
                                    ELSE second_friend
                                END
                                AS friend_id
                            FROM friends 
                            WHERE (SELECT id FROM users WHERE user_login=$1) IN(first_friend, second_friend)
                        )
                        AND
                        user_login <> $1
                    ORDER BY id
                `,
            values: [login]
        })
            .then(data => {
                res.json(data.rows)
            })
            .catch(err => console.log(err))
    })
    .put((req, res) => {
        const { first_user, second_user } = req.body
        console.log('Adding friends: ', first_user, second_user)
        pool.query({
            text: 'INSERT INTO friends(first_friend, second_friend) VALUES($1, $2)',
            values: [first_user, second_user]
        })
        .then(() => {
            console.log('////\nFriend added\n////')
            res.sendStatus(200)
        })
        .catch((err) => {
            res.sendStatus(500)
            console.log('Error while adding friend: ', err)
        })
    })
    .delete((req, res) => {
        const { first_user, second_user } = req.body
        console.log('Removing friends: ', first_user, second_user)
        pool.query({
            text: `DELETE FROM friends 
                WHERE
                (first_friend = $1 AND second_friend = $2)
                OR
                (second_friend = $1 AND first_friend = $2)`,
            values: [first_user, second_user]
        })
        .then(() => {
            res.sendStatus(200)
            console.log('Friend removed')
        })
        .catch((err) => {
            res.sendStatus(500)
            console.log('Error while removeinng friend: ', err)
        })
    })

api.post('/maybeYouKnow', (req, res) => {
    const login = req.body.login
    // console.log('exceptList: ', req.body )
    pool.query({
        text:
            `
                SELECT 
                id AS uuid,
                user_login AS login,
                avatar
                FROM users
                WHERE 
                    user_login <> $1 
                    AND 
                    NOT is_banned
                    AND
                    id NOT IN
                        (
                            SELECT
                            CASE
                                WHEN first_friend<>(SELECT id FROM users WHERE user_login=$1)
                                    THEN first_friend
                                    ELSE second_friend
                                END
                                AS friend_id
                            FROM friends 
                            WHERE (SELECT id FROM users WHERE user_login=$1) IN(first_friend, second_friend)
                        )
                ORDER BY RANDOM()
                LIMIT 6
            `,
        values: [login]
    })
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => console.log(`Error in getRandomUsers: ${err}`))
})

api.post('/createAccount', (req, res) => {
    const user = req.body
    pool.query({
        text: 'SELECT * FROM users WHERE user_login = $1',
        values: [user.login]
    })
        .then(data => {
            data.rowCount
                ?
                res.json({ error: "loginExists" })
                :
                pool.query({
                    text: `INSERT INTO users(user_login, user_name, email, user_password)
                      VALUES ($1, $2, $3, $4)
                      RETURNING $1 AS login`,
                    values: [user.login, user.name, user.email, user.password]
                })
                    .then(data => {
                        res.json(data.rows[0])
                    })
                    .catch(err => console.log(err))
        })
})

api.route('/user/session')
    .post((req, res) => {
        const {uuid, sessionId} = req.body
        pool.query({
            text: `INSERT INTO user_sessions(user_id, session_id)
                    VALUES($1, $2)`,
            values: [uuid, sessionId]
        })
        .then(() => {
            console.log('User connected, session id: ', sessionId)
            return res.status(200).end()
        })
        .catch(err => {
            console.log('Error while starting session: ', err)
            return res.status(500).end()
        })
    })
    .delete((req, res) => {
        const {uuid, sessionId} = req.body
        pool.query({
            text: `DELETE FROM user_sessions WHERE session_id = $1`,
            values: [sessionId]
        })
        .then(() => {
            console.log(`User ${uuid} disconnected`)
            pool.query({
              text: 'SELECT * FROM user_sessions WHERE user_id = $1',
              values: [uuid]
            })
            .then(data => {
                if (!data.rowCount) {
                    pool.query({
                        text: 'UPDATE users SET last_online = $1 WHERE id = $2',
                        values: [Date.now(), uuid] 
                    })
                    .then(() => {
                        return res.status(200).end()
                    })
                } else {

                    return res.status(200).end()
                }
            })
        })
        .catch(err => {
            console.log('Error while ending session: ', err)
            return res.status(500).end()
        })
    })

export default api