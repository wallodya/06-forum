export const getPostsForUser = (id) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: id }),
        })
            .then(data => data.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
};

export const submitLoginForm = (login, password) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                login: login,
                password: password
            }),
        })
            .then(data => data.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

export const getUserData = login => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/user", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: login })
        })
            .then(data => data.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

export const getUsers = (ids) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ids: ids })
        })
            .then((data) => {
                data.json()
            })
            .then((data) => {
                resolve(data)
            })
            .catch(err => reject(err))
    })
}

export const getAllUsers = () => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/users/all", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(data => data.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

export const getDeletedUsers = () => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/users/deleted", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
}

export const getFriendList = login => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/friends", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: login })
        })
            .then(data => data.json())
            .then(data => {
                resolve(data)
            })
            .catch(err => reject(err))
    })
}

export const getMaybeYouKnowList = (login) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/maybeYouKnow", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: login
            })
        })
            .then(data => data.json())
            .then(data => {
                resolve(data)
            })
            .catch(err => {
                console.log(err)
                reject()
            })
    })
}

export const createAccount = (user) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/createAccount", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(data => data.json())
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

export const deleteFriend = (id1, id2) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/friends", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_user: id1,
                second_user: id2
            })
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

export const addFriend = (id1, id2) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/friends", {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_user: id1,
                second_user: id2
            })
        })
            .then(() => resolve())
            .catch(err => reject(err))
    })
}

export const deleteUser = (login) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/user", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: login})
        })
        .then(() => resolve())
        .catch(err => reject(err))
    })
}

export const changeBanStatus = (login) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/user/ban", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: login})
        })
        .then(() => resolve())
        .catch(err => reject(err))
    })
}

export const getOnlineStatus = (uuid) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/user/online", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uuid: uuid})
        })
        .then(data => data.json())
        .then(data => resolve(data))  
        .catch(err => reject(err))
    })
}

export const saveNewPost = (post) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/post/new", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        .then(() => {
            console.log('saveNewPost success')
            resolve()
        })
        .catch(err => {
            console.log('Error in saving')
            reject(err)
        })
    })
}

export const deletePost = (postId) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/post", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: postId})
        })
        .then(() => resolve())
        .catch(err => reject(err))
    })
}

export const changeProfileData = (data) => {
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/user", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)  
        })
        .then(() => resolve())
        .catch(err => reject(err))
    })
}

export const closeSession = (uuid, ID) =>  {
    console.log('closing session: ', uuid, ID)
    if (!uuid) return
    fetch("http://62.113.97.215/api/user/session", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uuid: uuid,
            sessionId : ID
        }),
        keepalive: true
    })
    // return new Promise((resolve, reject) => {

    //     .then(() => resolve())
    //     .catch(err => reject(err))
    // })
}

export const openSession = (uuid, ID) =>  {
    console.log('openig session: ', uuid, ID)
    if (!uuid) return
    return new Promise((resolve, reject) => {
        fetch("http://62.113.97.215/api/user/session", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uuid: uuid,
                sessionId : ID
            })
        })
        .then(() => resolve())
        .catch(err => reject(err))
    })
}