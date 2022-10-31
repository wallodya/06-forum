import React, { useContext, useState } from "react";
import { InputLogin } from "./InputLogin";
import { InputPassword } from "./InputPassword";
import "./forms.css";
import "./login_form.css";
import { InputName } from "./InputName";
import { InputEmail } from "./InputEmail";
import { createAccount } from "../../api/api";
import { useLoginUpdate } from "../../context/LoginProvider";
import { useNavigate } from "react-router-dom";

const PasswordsContext = React.createContext()

export const RegisterForm = () => {

    const updateUser = useLoginUpdate()
    const navigate = useNavigate()

    const [firstPassword, setFirstPassword] = useState('')
    const [secondPassword, setSecondPassword] = useState('')

    const handleFirstPasswordChange = pswd => setFirstPassword(pswd)
    const handleSecondPasswordChange = pswd => setSecondPassword(pswd)

    const loginField = React.createRef()
    const nameField = React.createRef()
    const emailField = React.createRef()

    return (
        <div className="container-flex-column container-login-form card">
            <form
                className="container-flex-columnn login-form"
                autoComplete="off"
                onSubmit={event => {
                    event.preventDefault()
                    firstPassword !== secondPassword
                        ?
                        alert("Passwords don`t match")
                        :
                        createAccount({
                            login: loginField.current.value,
                            name: nameField.current.value,
                            email: emailField.current.value,
                            password: firstPassword
                        })
                        .then(data => {
                            console.log('New account data:')
                            console.table(data)
                            data.error
                                ? alert("Login already exists")
                                : updateUser(data.login)
                                    .then(() => {
                                        navigate('/' + data.login, { replace: true })
                                        window.location.reload(true)
                                    })
                        })
                }}
            >

                <h1 className="ff-heading fs-xl fw-bold text-gradient full-width">
                    Create
                    <br />
                    account
                </h1>
                <InputLogin ref={loginField}/>
                <InputName ref={nameField}/>
                <InputEmail ref={emailField}/>
                <InputPassword onChange={handleFirstPasswordChange}/>
                <InputPassword onChange={handleSecondPasswordChange}/>
                <input
                    type="submit"
                    value="Submit"
                    className="button-primary"
                />

            </form>
        </div>
    );
};
