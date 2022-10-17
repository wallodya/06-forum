// TODO:
// 2) Clean up CSS
// 3) Make class for posts

import {socket} from '../sockets.js'
// import * as Elements from './elements.js'
// import * as Cookies from '../cookies.js'
import * as Pages from './pages.js'
import { renderPath } from '../router.js'
const styles = import.meta.glob('../../style/*.css', {eager: true})
const elementStyles = import.meta.glob('../../style/elements/*.css', {eager: true})
const headerStyles = import('../../style/elements/nav/header.css')


export const renderPage = (user) => {
    // Getting root element and creating main wrap divs
    const ROOT = document.getElementById('root')
      
    const content = document.createElement('div')
    const contentWrap = document.createElement('div')
    const header = document.createElement('div')
    const page = document.createElement('div')

    const loader = document.createElement('div')
    loader.setAttribute('class', 'lds-grid')
    loader.innerHTML = '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>'
    
    // Content center is added in case side bars will be added later (content-side)
    // All elements aside from header will be rendered inside 'content' element
    content.setAttribute('class', '__page-content-center') 
    content.setAttribute('id', 'content')
    contentWrap.setAttribute('class', '__page-content-wrap')
    header.setAttribute('class', '__page-header-wrap')
    page.setAttribute('class', '__page-wrap')
    
    
    ROOT.innerHTML = ''


    // renderPage resieves object user with data about loggin user,
    // when user=null client is considered a guest user (may change later)
    header.append(Pages.renderHeader())
    contentWrap.append(content)
    page.append(header, contentWrap)
    
    // Calling render path function on page load (when renderPage() is called from '/main.js' file)
    renderPath()

    // Calling renderPath() when onPopState event is fired with isPopState flag set to true
    onpopstate = () => {
        console.log('popState fired')
        renderPath(true)
    }
    
    // Appending page wrapper element to the #root div inside '/index.html'

    ROOT.append(page)   
}


