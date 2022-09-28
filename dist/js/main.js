// 1) User and Profile pages open w/o UUID in path 


import * as Renderer from './views/renderer.js'
import * as Cookies from './cookies'
const user = Cookies.userId ?? null
import { socket } from "./sockets.js"

console.log('User: ', user)

console.log('LS: ')
console.log(localStorage)

// user
//     ? Renderer.renderPage(user)
//         : LS.addUserToLocalStorage

// LS.addUserToLocalStorage(user)
//     .then(() => Renderer.renderPage(user))

Renderer.renderPage(user)