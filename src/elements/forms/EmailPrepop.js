import React, { useRef } from "react";
import { labelStyles } from "./utils";
import { toggleLabel } from "./utils";

export const EmailPrepop = ({ email, onChange : setEmailField }) => {

    const label = useRef()
    const input = useRef()

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
                defaultValue={email}
                name="email"
                minLength="4"
                maxLength="20"
                title="Should contain from 4 to 15 characters"
                required=""
                className="input-field"
                ref={input}
                onChange={() => {
                    toggleLabel(input, label)
                    setEmailField(input.current.value)
                }}
            />
        </>
    );
};
