import React from "react";
import { DeletedUserBadge } from "../userBadge/DeletedUserBadge";


export const DeletedUsersList = ({users}) => {
    return (
        <div className="container-grid-auto-columns full-width">
            {users.map((user, i) => <DeletedUserBadge key={i} user={user}/>)}
        </div>
    );
};
