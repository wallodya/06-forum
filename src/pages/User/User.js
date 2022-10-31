import React from "react";
import { useUser } from "../../context/UserProvider";
import { Newsfeed } from "../../elements/CardWide/Newsfeed";
import "../../style/global.css";
import "../../style/user_profile.css";
import { FriendList } from "./FriendList";
import { MaybeYouKnow } from "./MaybeYouKnow";
import { UserTopContainer } from "./UserTopContainer";

export const User = () => {

    const { isOwner, userOwner: { is_banned } } = useUser()

    return (
        <div>
            <UserTopContainer />
            {
                !is_banned
                &&
                <>
                    <FriendList />
                    { isOwner && <MaybeYouKnow /> }
                    <Newsfeed />
                </>
            }
        </div>
    );
};
