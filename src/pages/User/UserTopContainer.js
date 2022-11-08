import React from 'react'
import { useUser } from '../../context/UserProvider';
import { CardWideRow } from '../../elements/CardWide/CardWideRow'
import { OnlineStatus } from '../../elements/onlineStatus/OnlineStatus';
import { PrimaryButton } from '../../elements/buttons/PrimaryButton';
import { useLogin } from '../../context/LoginProvider';
import { AdminControls } from './AdminControls';
import { useFriends, useFriendshipButton } from '../../context/FriendsProvider';
import default_prof_pic from '../../lib/img/default_prof_pic.png'


export const UserTopContainer = () => {
    const { isOwner, userOwner : { is_banned, uuid } } = useUser()
    // const user = useLogin()
    const { is_admin, uuid : uuidClient } = useLogin()
    const isloggedIn = !!uuidClient
    const { isFriend } = useFriends()
    const handleFriendshipButton = useFriendshipButton()
    return (
        <CardWideRow dir={"row"}>
            <Avatar />
            <div className="container-flex-column user-legend-container">
                <Username />
                <OnlineStatus isLarge={true} isBanned={is_banned} uuid={uuid}/>
                <Email />
                {  
                    isloggedIn
                    &&
                    !isOwner
                    &&
                    !is_banned
                    &&
                    <PrimaryButton
                        text={isFriend ? 'Remove friend' : 'Add friend'}
                        onClick={handleFriendshipButton}
                    />
                }
            </div>

            {
                !isOwner
                &&
                is_admin
                &&
                <AdminControls />
            }
        </CardWideRow>
    )
}

const Avatar = () => {
    const { userOwner : { avatar : src } } = useUser()
    return (
        <img
            className="avatar-profile"
            src={
                src === '../lib/img/default_prof_pic.png' || !src
                            ? default_prof_pic
                            : src
            }
            alt="avatar"
        />
    );
};

const Username = () => {
    const { userOwner : { login } } = useUser()
    return (
        <p className="ff-body fs-l fw-bold text-primary-100 username-profile">
            {login}
        </p>
    );
};

const Email = () => {
    const { userOwner : { email } } = useUser()
    return (
        <p className="ff-body fs-m fw-regular text-primary-60">
            {email}
        </p>
    )
}