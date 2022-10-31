import React from "react";

export const CardWideRow = props => {
    return (
        <div className="container-flex-row card-round margin-top-m full-width">
            {props.children}
        </div>
    );
};
