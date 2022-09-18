// TODO:
// 1) Deal with css imports
// 2) Clean up CSS
// 3) Make class for posts


import * as Elements from './elements.js'
import * as Cookies from '../cookies.js'

// Getting root element and creating main wrap divs
const ROOT = document.getElementById('root')
  
const content = document.createElement('div')
const contentWrap = document.createElement('div')
const header = document.createElement('div')
const page = document.createElement('div')

// Content center is added in case side bars will be added later (content-side)
// All elements aside from header will be rendered inside 'content' element
content.setAttribute('class', '__page-content-center') 

contentWrap.setAttribute('class', '__page-content-wrap')
header.setAttribute('class', '__page-header-wrap')
page.setAttribute('class', '__page-wrap')



export const renderPage = (user) => {
    // renderPage resieves object user with data about loggin user,
    // when user=null client is considered a guest user (may change later)

    

    const renderPath = (isPopState=false, path=location.pathname) => {
        // isPopState flag shows whether the popstate event was fired
        // When true history.pushState shouldnt be applied because url changes automatically
        

        // Getting page name annd user ID from url path if it is present
        let [ , page, id] = /(\/[A-z]+)(\d{6})/g.exec(path) ?? [ , path, null]
        console.log(`rendering path: ${page}, userId in url: ${id}`)
        
        
        // Rendering content depending on url or a path from a renderPath function
        let newContent = ''
        switch (page) {
            case '' || '/': {
                // For now homepage ('/') redirects(rerenders) to a user page or login page for a guest user
                user.isUser
                    ? newContent = renderPath(false, '/user')
                    : newContent = renderPath(false, '/login')
                return
            }
            case '/login': {
                newContent = renderLoginForm()
                break
            }
            case '/registr': {
                newContent = renderRegisterForm()
                break
            }
            case '/user': {
                // For now user page is accessible no matter what status client has
                newContent = renderUser(id)
                break
            }
            case '/profile': {
                // Profile page is only accessible to the owner or admin
                if (Cookies.userId != id && !Cookies.DB_TEST[Cookies.userId].isAdmin) {
                    console.log('not owner')
                    renderPath(false, '/login')
                    return
                } else {
                    newContent = renderUserProfile(id)
                }
                
                break
            }
            case '/admin': {
                // Admin page is accessible only to admin (users with isAdmin flag set to true)
                // Other users are redirected to the login page
                console.log(`User ${Cookies.userId} tries to render an admin page. isAdmin: ${Cookies.DB_TEST[Cookies.userId].isAdmin}`)
                if (Cookies.DB_TEST[Cookies.userId].isAdmin) {
                    console.log('Permission granted')
                    newContent = renderAdmin()
                } else {
                    console.log('Permission denied')
                    renderPath(false, '/login')
                    return
                }
                
                break
            }
            default: {
                // 404 page
                newContent = render404()
            }
        }

        // Pushing new url path only when isPopState flag is false
        if (!isPopState) {
            history.pushState(null, '', `${location.origin}${path}`)
        }

        // Adding smooth transitions between "pages"
        content.style.opacity = '0'
        setTimeout(() => {
            content.innerHTML = ''
            content.append(newContent)
            content.style.opacity = '1'
        }, 100)
    }

    const renderHeader = (userId) => {

        let isUser = !!userId
        const user = Cookies.DB_TEST[userId]

        const header = new Elements.Element(
            'div',
            ['container-flex-row-header']
        ).__init__()
        const loginButton = new Elements.Button(
            'primary', 
            'Login', 
        ).__init__()

        // Adding admin button  if user is admin
        if (user.isAdmin) {
            var adminButton = new Elements.Element(
                'button',
                ['button-secondary-admin'],
                null,
                'admin'
            ).__init__()

            adminButton.onclick = () => {
                renderPath(false, '/admin')
            }

            header.append(adminButton)
        }

        // Adding username, avatar and logout button for a user or login button for a guest
        if (isUser) {
            var usernameField = new Elements.Element(
                'p',
                ['text-primary-100', 'fw-regular', 'fs-m', 'ff-body', 'username-header'],
                null,
                user.userName
            ).__init__()
            var userAvatar = new Elements.Element(
                'div',
                ['avatar-header'],
                null
            ).__init__()
            console.log(user.avatarLink)
            userAvatar.style.background = `center/contain no-repeat url(${user.avatarLink})`
            loginButton.innerText = 'Logout'

            // Setting onclick events for username and avatar
            userAvatar.onclick = () => {
                renderPath(false, '/profile' + userId)
            }
            usernameField.onclick = () => {
                renderPath(false, '/user' + userId)
            }

            header.append(usernameField, userAvatar, loginButton)
        } else {
            loginButton.innerText = 'Login'
            loginButton.style.marginLeft = 'auto'
            header.append(loginButton)
        }

        // Onclick event for login/logout button
        loginButton.onclick = () => {
            if (isUser) {
                usernameField.style.scale = '0'
                if (user.isAdmin) adminButton.style.scale = '0'
                userAvatar.style.scale = '0'
                loginButton.innerText = 'Login'
                isUser = false
                renderPath(false, '/')
            } else {
                usernameField.style.scale = '1'
                if (user.isAdmin) adminButton.style.scale = '1'
                userAvatar.style.scale = '1'
                loginButton.innerText = 'Logout'
                isUser = true
                renderPath(false, '/login')
            }
        }
        return header
    }
    
    const renderLoginForm = () => {

        // Rendering login form
        const loginForm = new Elements.Form(
            'Login',
            [
                {
                    type: "text", placeholder: "Login", name: "login",
                    minlength: "4", maxlength: "15", pattern: "[A-z0-9]{4,15}",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
                {
                    type: "password", placeholder: "Password", name: "password",
                    minlength: "4", maxlength: "15", pattern: "[A-z0-9]{4,15}",
                    title: "Should contain from 4 to 15 characters", required: ""
                }
            ]
        ).__init__()
        loginForm.onsubmit = (event) => {
            event.preventDefault()
            console.log(loginForm.login.value, loginForm.password.value)
        }


        // Rendering create account button
        const registerButton = new Elements.Button(
            'secondary',
            'Create account'
        ).__init__()
        registerButton.onclick = () => {
            renderPath(false, '/registr')
        }


        const loginFormContainer = new Elements.Container(
            [loginForm, registerButton],
            ['container-flex-column', 'container-login-form', 'card']
        ).__init__()

    
        return(loginFormContainer)
    }
    
    const renderRegisterForm = () => {
        const registerForm = new Elements.Form(
            'Create account',
            [
                {
                    type: "text", placeholder: "Login", name: "login",
                    minlength: "4", maxlength: "15", pattern: "[A-z0-9]{4,15}",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
                {
                    type: "text", placeholder: "Full name", name: "name",
                    minlength: "4", maxlength: "20", pattern: "[A-z]{4,20}",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
                {
                    type: "email", placeholder: "e-mail", name: "email",
                    minlength: "4", maxlength: "20",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
                {
                    type: "password", placeholder: "Password", name: "password",
                    minlength: "4", maxlength: "15", pattern: "[A-z0-9]{4,15}",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
                {
                    type: "password", placeholder: "Confirm password", name: "passwordConfirm",
                    minlength: "4", maxlength: "15", pattern: "[A-z0-9]{4,15}",
                    title: "Should contain from 4 to 15 characters", required: ""
                }
            ],
            ['container-flex-column', 'container-login-form', 'login-form', 'card']
        ).__init__()

        registerForm.onsubmit = (event) => {
            event.preventDefault()
            //Validation
            console.log(
                    registerForm.login.value,
                    registerForm.name.value,
                    registerForm.email.value,
                    registerForm.password == registerForm.passwordConfirm.value
                )
            //Socket emit
        }
        
        return registerForm
    }
    
    const renderUser = (userId) => {

        const isUser = !!userId
        const isOwner = Cookies.userId == userId
        
        const user = Cookies.DB_TEST[userId]
        console.log(`Is owner: ${isOwner}`)


        // Rendering users bio
        const avatarProfile = new Elements.Element(
            'div',
            ['avatar-profile']
        ).__init__()
        avatarProfile.style.background = `center/contain no-repeat url(${user.avatarLink})`

        const username = new Elements.Element(
            'p',
            ['ff-body', 'fs-l', 'fw-bold', 'text-primary-100', 'username-profile'],
            null,
            user.userName
        ).__init__()
        const email = new Elements.Element(
            'p',
            ['ff-body', 'fs-m', 'fw-regular', 'text-primary-60'],
            null,
            user.email
        ).__init__()

        const userLegendContainer = new Elements.Container(
            [username, email],
            ['container-flex-column', 'user-legend-container']
        ).__init__()
        const userInfoContainer = new Elements.Container(
            [avatarProfile, userLegendContainer],
            ['container-flex-row', 'card-round', 'full-width', 'margin-top-m']
        ).__init__()

        
        // Rendering friends of a user
        const userFriendsHeader = new Elements.Element(
            'h2',
            ['ff-heading', 'fs-l', 'fw-bold', 'text-gradient', 'full-width'],
            null,
            'Friends'
        ).__init__()
        const userFriendsList = new Elements.Element(
            'div',
            ['container-grid-auto-columns', 'full-width']
        ).__init__()
        const userFriendsContainer = new Elements.Container(
            [userFriendsHeader, userFriendsList],
            ['container-flex-column', 'card-round', 'full-width']
        ).__init__()
        
        for (let user of Cookies.DB_TEST[userId].friendList) {
            const userBadge = new Elements.UserBadge(Cookies.DB_TEST[user], {id: user}, false).__init__()
            userFriendsList.append(userBadge)
            userBadge.onclick = () => {
                renderPath(false, '/user' + user)
            }
        }
            
        
        // Rendering news feed
        const userNewsFeedHeader = new Elements.Element(
            'h2',
            ['ff-heading', 'fs-l', 'fw-bold', 'text-gradient'],
            null,
            'Feed'
        ).__init__()
        const userNewsFeed = new Elements.Element(
            'div',
            []
        ).__init__()
        const userNewsFeedContainer = new Elements.Container(
            [userNewsFeedHeader, userNewsFeed],
            ['news-feed-container-user', 'card-round', 'full-width']
        ).__init__()


        const userProfileWrap = new Elements.Container(
            [userInfoContainer, userFriendsContainer, userNewsFeedContainer]
        ).__init__()

        return(userProfileWrap)
    }
    
    const renderUserProfile = (userId) => {
        
        const user = Cookies.DB_TEST[userId]

        // Rendering top container with profile pic
        const profilePic = new Elements.Element(
            'div',
            ['avatar-profile',]
        ).__init__()
        profilePic.style.background = `center/contain no-repeat url(${user.avatarLink})`
        const newProfilePicButton = new Elements.Button('primary', 'Change avatar').__init__()
        const profileTopContainer = new Elements.Container(
            [new Elements.Container([profilePic, newProfilePicButton]).__init__()],
            ['card-round', 'margin-top-m']
        ).__init__()

        // Rendering form for editing profile data
        const profileForm = new Elements.Form(
            'Edit',
            [
                {
                    type: "text", value: user.name, readonly: ""
                },
                {
                    type: "text", value: user.userName, placeholder: "Login", name: "login",
                    minlength: "4", maxlength: "15", pattern: "[A-z]{4,15}",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
                {
                    type: "email", value: user.email, placeholder: "e-mail", name: "email",
                    minlength: "4", maxlength: "20",
                    title: "Should contain from 4 to 15 characters", required: ""
                },
            ],
            ['container-flex-column', 'login-form', 'card-round']
        ).__init__()

        profileForm.onsubmit = (event) => {
            event.preventDefault()
            console.log(
                profileForm.login.value,
                profileForm.email.value
            )
        }
        
        const profilePageWrap = new Elements.Container(
            [profileTopContainer, profileForm],
        ).__init__()
        
        return(profilePageWrap)
    }
    
    const renderAdmin = () => {

        // Rendering list of all users (except deleted ones)
        const adminAllUsersHeader = new Elements.Element(
            'h2',
            ['ff-heading', 'fs-l', 'fw-bold', 'text-gradient', 'full-width'],
            null,
            'All users'
        ).__init__()
        const adminAllUsersList = new Elements.Element(
            'div',
            ['container-grid-auto-columns', 'full-width']
        ).__init__()
        const adminAllUsersContainer = new Elements.Container(
            [adminAllUsersHeader, adminAllUsersList],
            ['container-flex-column', 'card-round', 'margin-top-m',  'full-width']
        ).__init__()

        for (let user in Cookies.DB_TEST) {
            const userBadge = new Elements.UserBadge(Cookies.DB_TEST[user], {id: user}, true).__init__()
            console.log(user)
            userBadge.onclick = () => {
                renderPath(false, '/user' + user)
            }
            adminAllUsersList.append(userBadge)
        }
        
        // Rendering list of all deleted users
        const adminDeletedUsersHeader = new Elements.Element(
            'h2',
            ['ff-heading', 'fs-l', 'fw-bold', 'text-gradient', 'full-width'],
            null,
            'Deleted Users'
        ).__init__()
        const adminDeletedUsersList = new Elements.Element(
            'div',
            ['container-grid', 'full-width']
        ).__init__()
        const adminDeletedUsersContainer = new Elements.Container(
            [adminDeletedUsersHeader, adminDeletedUsersList],
            ['conatiner-flex-column', 'card-round', 'full-width']
        ).__init__()


        const adminPageWrap = new Elements.Container(
            [adminAllUsersContainer, adminDeletedUsersContainer],
            ['container-flex-column']
        ).__init__()
        return(adminPageWrap)
    }

    const render404 = () => {
        const errorMessage = new Elements.Element(
            'h1',
            ['container-flex-columns', 'ff-heading', 'fs-xxl', 'fw-bold', 'text-gradient', 'full-width'],
            null,
            '404\nPage doesn\'t exist'
        ).__init__()
        errorMessage.style.marginTop = 'var(--header-height)'
        
        return(errorMessage)
    }

    // Addeing header and inserting the content inside main page wrap divs
    header.append(renderHeader(user))
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


