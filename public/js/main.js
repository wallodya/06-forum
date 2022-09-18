import * as Renderer from './views/renderer.js'
import * as Cookies from './cookies.js'
const user = Cookies.userId ?? null

Renderer.renderPage(user)