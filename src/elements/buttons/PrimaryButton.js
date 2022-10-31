import React from "react";
import "./buttons.css";

export const PrimaryButton = ({ text, onClick, style}) => {
    return (
        <button 
            className="button-primary" 
            style={style}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
