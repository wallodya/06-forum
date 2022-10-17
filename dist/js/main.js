// 1) User and Profile pages open w/o UUID in path 

import { addUserToLocalStorage } from './cookies'
import * as Renderer from './views/renderer.js'
import * as Cookies from './cookies'
const user = Cookies.userId ?? null
import { socket } from "./sockets.js"

console.log('User: ', user)

console.log('LS: ')
console.log(localStorage)

user && (localStorage.length <= 1)
    ? addUserToLocalStorage(user)
      .then(() => Renderer.renderPage(user))
      .catch(err => {
        console.log('Err in main.js: ')
        console.log(err)
    })
    : Renderer.renderPage(user)
