import * as Renderer from './views/renderer.js'
import * as Cookies from './cookies.js'
const user = Cookies.userId ?? null

console.log('Env var test:' + import.meta.env.VITE_HOST +  ' ' + import.meta.env.VITE_TEST )
console.log('dotenv:')
console.dir(import.meta.env)


Renderer.renderPage(user)