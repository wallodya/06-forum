import React from "react";
import "./buttons.css";

export const SecondaryButton = ({ text, onClick}) => {
    return (
        <button 
            className="button-secondary" 
            onClick={onClick}
        >
            {text}
        </button>
    );
};
