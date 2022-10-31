import React, { useRef } from "react";
import './forms.css'
import { labelStyles, toggleLabel } from "./utils";

export const InputPassword = ({ onChange }) => {

    const label = useRef()
    const inputPassword = useRef()

    return (
        <>
            <label
                htmlFor="password"
                className="input-label fs-s fw-bold text-primary-60 full-width"
                style={labelStyles}
                ref={label}
            >
                Password
            </label>
            <input
                type="password"
                placeholder="Password"
                name="password"
                minLength="4"
                maxLength="15"
                pattern="[A-z0-9]{4,15}"
                title="Should contain from 4 to 15 characters"
                required
                className="input-field"
                ref={inputPassword}
                onChange={() => {
                    toggleLabel(inputPassword, label)
                    onChange(inputPassword.current.value)
                }}
            ></input>
        </>
    );
};
