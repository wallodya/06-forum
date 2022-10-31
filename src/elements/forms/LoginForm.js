import React, { useRef, useState } from "react";
import { InputLogin } from "./InputLogin";
import { InputPassword } from "./InputPassword";
import './forms.css'
import './login_form.css'
import { SecondaryButton } from "../buttons/SecondaryButton";
import { useNavigate } from "react-router-dom";
import { submitLoginForm } from "../../api/api";
import { useLoginUpdate } from "../../context/LoginProvider";

export const LoginForm = () => {

    const navigate = useNavigate()
    const loginField = React.createRef()
    const passwordField = React.createRef()
    const loginFailMessage = useRef()

    const [isLoginFailMessageShown, setIsLoginFailMessageShown] = useState(false)
    const updateUser = useLoginUpdate()

    const [password, setPassword] = useState('')
    const handlePasswordInput = pswd => setPassword(pswd)

    return (
        <div className="container-flex-column container-login-form card">

            <form 
                autoComplete="off"
                className="container-flex-columnn login-form" 
                onChange={() => {
                    setIsLoginFailMessageShown(false)
                }}
                onSubmit={(event) => {
                    event.preventDefault()
                    submitLoginForm(loginField.current.value, password)
                        .then(data => {
                            data
                                ? updateUser(data.login)
                                    .then(() => {
                                        navigate('/' + data.login, {replace: true})
                                        window.location.reload(true)
                                    })
                                : setIsLoginFailMessageShown(true)
                        })
                }}
            >

                <h1 className="ff-heading fs-xl fw-bold text-gradient">Login</h1>
                <InputLogin ref={loginField}/>
                <InputPassword onChange={handlePasswordInput}/>

                <p 
                    className="fw-bold fs-s text-accent-100" 
                    style={{
                        display: isLoginFailMessageShown ? 'block' : 'none'
                    }}
                    ref={loginFailMessage}
                >
                    Wrong login or password
                </p>

                <input type="submit" value="Submit" className="button-primary" />

            </form>

            <SecondaryButton text={'Create account'} onClick={() => navigate('/register')} />

        </div>
    );
};