import React, { useRef } from "react";
import { labelStyles, toggleLabel } from "./utils";
import './forms.css'

export const InputEmail = React.forwardRef((props, emailField) => {

    const label = useRef()

    return (
        <>
            <label
                htmlFor="email"
                className="input-label fs-s fw-bold text-primary-60 full-width"
                style={labelStyles}
                ref={label}
            >
                e-mail
            </label>
            <input
                type="email"
                placeholder="e-mail"
                name="email"
                minLength="4"
                maxLength="20"
                title="Should contain from 4 to 15 characters"
                required
                className="input-field"
                ref={emailField}
                onChange={() => toggleLabel(emailField, label)}
            />
        </>
    );
});
