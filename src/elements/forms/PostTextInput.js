import React, { useRef } from "react";
import { labelStyles } from "./utils";
import { toggleLabel } from "./utils";

export const PostTextInput = React.forwardRef(({ onChange : setPostText }, textField) => {

    const label = useRef()

    return (
        <>
            <label
                htmlFor="postText"
                className="input-label fs-s fw-bold text-primary-60 full-width"
                style={labelStyles}
                ref={label}
            >
                Enter your text
            </label>
            <input
                type="text"
                placeholder="Enter your text"
                name="postText"
                minLength="0"
                maxLength="200"
                pattern="\w{0,200}"
                title="Should contain from 4 to 15 characters"
                className="input-field"
                ref={textField}
                onChange={() => {
                    toggleLabel(textField, label)
                    setPostText(textField.current.value)
                }}
            />
        </>
    );
});