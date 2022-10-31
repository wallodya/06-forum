import React, { useRef } from "react";
import { labelStyles, toggleLabel } from "./utils";
import './forms.css'

export const InputName = React.forwardRef((props, nameField) => {

    const label = useRef()

    return (
        <>
            <label
                htmlFor="name"
                className="input-label fs-s fw-bold text-primary-60 full-width"
                style={labelStyles}
                ref={label}
            >
                Full name
            </label>
            <input
                type="text"
                placeholder="Full name"
                name="name"
                minLength="4"
                maxLength="20"
                pattern="[A-z ]{4,20}"
                title="Should contain from 4 to 15 characters"
                required
                className="input-field"
                ref={nameField}
                onChange={() => toggleLabel(nameField, label)}
            ></input>
        </>
    );
});
