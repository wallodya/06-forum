import * as Renderer from './views/renderer.js'
import * as Cookies from './cookies.js'
const user = Cookies.userId ?? null
import { socket } from "./sockets.js"

console.log('User: ', user)

console.log('LS: ')
console.log(localStorage)

Cookies.addUserToLocalStorage(user)
    .then(() => Renderer.renderPage(user))