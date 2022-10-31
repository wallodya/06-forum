import React, { useRef } from "react";
import { labelStyles } from "./utils";
import { toggleLabel } from "./utils";


export const NamePrepop = ({ name , onChange : setNameField}) => {

    const label = useRef()
    const input = useRef()

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
                defaultValue={name}
                name="name"
                minLength="4"
                maxLength="20"
                pattern="[A-z ]{4,20}"
                title="Should contain from 4 to 15 characters"
                required
                className="input-field"
                ref={input}
                onChange={() => {
                    toggleLabel(input, label)
                    setNameField(input.current.value)
                }}
            ></input>
        </>
    );
};
