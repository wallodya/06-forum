import React, { useRef } from "react";
import { User } from "../../pages/User/User";
import './forms.css'
import { labelStyles, toggleLabel } from "./utils";

export const InputLogin = React.forwardRef((props, loginField) => {

    const label = useRef()

    return (
        <>
            <label
                htmlFor="login"
                className="input-label fs-s fw-bold text-primary-60 full-width"
                style={labelStyles}
                ref={label}
            >
                Login
            </label>
            <input
                type="text"
                placeholder="Login"
                name="login"
                minLength="4"
                maxLength="15"
                pattern="[A-z0-9]{4,15}"
                title="Should contain from 4 to 15 characters"
                required
                className="input-field"
                ref={loginField}
                onChange={() => toggleLabel(loginField, label)}
            />
        </>
    );
});
