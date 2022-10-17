import { getUsersData } from "../sockets"
import { getOnlineStatus } from "../sockets"
import { renderPath } from "../router"


export class Element {
    constructor(_tag, _classList, _attrList, _text, _children) {
        this.tag = _tag ?? 'div'
        this.classList = _classList ?? []
        this.attrList = _attrList ?? {}
        this.text = _text ?? ''
        this.children = _children ?? []
    }

    __init__ () {
        const el = document.createElement(this.tag)
        for (let attrName in this.attrList) {
            el.setAttribute(attrName, this.attrList[attrName] ?? null)
        }
        for (let className of this.classList) {
            el.classList.add(className)
       }
        el.innerText = this.text
        for (let child of this.children) {
            el.append(child)
        }
        return el
    }   
}

export class Container extends Element {
    constructor (_children, _classList=['container-flex-column'], _attrList={}) {
        super (
            'div',
            _classList,
            _attrList,
            null,
            _children
        )
    }
}

export class Button extends Element {
    constructor (_type, _text, _classList, _attrList, _children) {
        _classList = _classList ?? []
        _type = _type ?? 'primary'
        switch (_type) {
            case 'primary': {
                _classList = ['button-primary', ..._classList]
                break
            }
            case 'secondary': {
                _classList = ['button-secondary', ..._classList]
                break
            }
            default: {
                _classList = ['button-primary', ..._classList]
            }
        }
        super ('button', _classList, _attrList, _text ?? 'Submit', _children)
        this.type = _type ?? 'primary'
    }
}
export class OnlineStatus extends Element{
    constructor(_userId, _classList) {
        super('p', _classList, {id: _userId})
    }
}

export class UserBadge extends Container {
    constructor (_userInfo, _attrList, _isOnAdminPage=false, _isDeleted=false) {
        let badgeContent = []
        const avatar = new Element(
            'img',
            ['avatar-header'],
            {src: _userInfo.avatar}
        ).__init__()

        // _isDeleted
        //     ? avatar.style.background = 'center/contain no-repeat url(../lib/img/deleted_prof_pic.png)'
        //     : avatar.style.background = `center/contain no-repeat url(${_userInfo.avatar})`
        badgeContent.push(avatar)

        const username = new Element(
            'p',
            ['ff-body', 'fs-s', 'fw-regular', 'text-primary-100'],
            null,
            _userInfo.user_login
        ).__init__()

        if (_isDeleted) {
            const legendContainer = new Container(
                [username],
                ['container-flex-column', 'badge-legend-container']
            ).__init__()
            legendContainer.style.justifyContent = 'center'
            badgeContent.push(legendContainer)
            super (badgeContent, ['card-round', 'container-flex-row', 'full-width', 'user-badge-admin-deleted'], _attrList)
            return
        }

        let status = new OnlineStatus(
            _attrList.id,
            ['ff-body', 'fs-xs', 'fw-light', 'text-primary-40'],
        ).__init__()

        const legendContainer = new Container(
            [username, status],
            ['container-flex-column', 'badge-legend-container']
        ).__init__()
        
        const bannedBadge = new Element(
            'p',
            ['ff-body', 'fs-s', 'fw-bold', 'text-accent-60'],
            null,
            'banned'
        ).__init__()

        const info = []
 
        if (_userInfo.is_banned) info.push(bannedBadge)
        
        if (info) {
            var infoContainer = new Container(info, ['container-flex-column', 'badge-info-container']).__init__()
        }
        
        badgeContent = badgeContent.concat([legendContainer, infoContainer])

        super (badgeContent, ['card-round', 'container-flex-row', 'full-width', 'user-badge-admin'], _attrList)
    }
}

export class Input extends Element {
    constructor (_attrList, _classList=[]) {
        _classList.push('input-field')
        super ('input', _classList, _attrList, null, null)
    }
}

export class InputLabel extends Element {
    constructor (_parentAttributes) {
        super (
            'label',
            ['input-label', 'fs-s', 'fw-bold', 'text-primary-60', 'full-width'],
            {for: _parentAttributes.name}, _parentAttributes.placeholder,
            null
        )
    }
}

export class Form extends Element {
    constructor (_heading='', _inputFields=[], _classList=[], _attrList={}, _buttonText='Submit', _hasAnimation=true) {
        let formChildren = []

        const heading = new Element(
            'h1',
            ['ff-heading', 'fs-xl', 'fw-bold', 'text-gradient'],
            null,
            _heading
        ).__init__()
        if (_heading) {formChildren.push(heading)}
        
        let isFirstInput = true
        for (let field of _inputFields) {
            const label = new InputLabel(field).__init__()
            const input = new Input(field).__init__()

            if (!isFirstInput && _hasAnimation) {
                label.classList.add('label-unused')
                input.classList.add('input-unused')
            }
            isFirstInput = false

            formChildren.push(label)
            formChildren.push(input)

            label.style.marginBottom = '-1rem'
            label.style.opacity = '0'

            input.addEventListener('input', () => {
                const newInputEvent = new Event('newInputAfterFail', {'bubbles': true})
                window.dispatchEvent(newInputEvent)
                
                label.classList.remove('label-unused')
                input.classList.remove('input-unused')

                label.style.opacity = '1'
                if (input.value === '') {
                    label.style.opacity = '0'
                }

                if (!input.checkValidity()) {

                    if (input.validity.tooShort) {
                        input.setCustomValidity('Should be 4 symbols or longer')
                    } else if (input.validity.patternMismatch) {
                        input.setCustomValidity('Input contains restricted characters')
                    } else {
                        input.setCustomValidity('')
                    }
                    input.reportValidity()                
                }
            })
        }

        const submitButton = new Element(
            'input',
            ['button-primary'],
            {type: "submit", value: _buttonText}
        ).__init__()
        formChildren.push(submitButton)

        super (
            'form',
            ['container-flex-columnn', 'login-form', ..._classList],
            _attrList,
            null,
            formChildren
        )
    }
}

export class Post extends Element {
    constructor () {
        super ()
    }
}


export const loadUserBadges = (_users, _container, _isOnAdminPage=false) => {
    // console.log('Loading badges for: ', _users)
    if (!_users || !_users[0]) {
        console.log('No badges need to be loaded');
        return
    }   
    // console.log('loadUserBadges isArray: ', Array.isArray(_users))
    getUsersData(_users)
    .then(data => {
        let p = Promise.resolve()
        // console.log('data:')
        // console.log(data);
        for (let user of data) {
            // console.log('loadUserBadges loading user:', user)
            const userBadge = new UserBadge(user, {id: `${user.id}`}, _isOnAdminPage).__init__()
            p = p.then(() => {
                userBadge.childNodes[1].childNodes[1].innerText = 'loading...'
                userBadge.childNodes[1].childNodes[1].classList.add('loading-text')
                getOnlineStatus(user.id)
                .then(status => {                    
                    userBadge.childNodes[1].childNodes[1].classList.remove('loading-text')
                    userBadge.childNodes[1].childNodes[1].innerText = status
                })
                .catch(status => userBadge.childNodes[1].childNodes[1].innerText = status)
            })
            
            userBadge.onclick = () => {
                renderPath(false, '/user' + user.id)
            }
            _container.append(userBadge)
        }
    })
    .catch(err => console.log('Error in loadUserBadges: ', err))
} 