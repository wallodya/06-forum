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

export class UserBadge extends Container {
    constructor (_userInfo, _attrList, _isOnAdminPage=false, _isDeleted=false) {
        let badgeContent = []
        const avatar = new Element(
            'div',
            ['avatar-header']
        ).__init__()
        avatar.style.background =  `center/contain no-repeat url(${_userInfo.avatarLink})`
        badgeContent.push(avatar)

        const username = new Element(
            'p',
            ['ff-body', 'fs-s', 'fw-regular', 'text-primary-100'],
            null,
            _userInfo.userName
        ).__init__()
        const status = new Element(
            'p',
            ['ff-body', 'fs-s', 'fw-light', 'text-primary-40'],
            null,
            'online'
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
        const deleteButton = new Button(
            'primary',
            'Del',
            ['delete-user-button', 'fs-s']
        ).__init__()
        const info = []
        if (_isOnAdminPage) info.push(deleteButton)
        if (_userInfo.isBanned) info.push(bannedBadge)
        
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
    constructor (_heading='', _inputFields=[], _classList=[], _attrList={}, _buttonText='Submit') {
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

            if (!isFirstInput) {
                label.classList.add('label-unused')
                input.classList.add('input-unused')
            }
            isFirstInput = false

            formChildren.push(label)
            formChildren.push(input)

            label.style.marginBottom = '-1rem'
            label.style.opacity = '0'

            input.addEventListener('input', () => {
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