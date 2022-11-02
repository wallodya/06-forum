import React, { useState } from "react";
import { useFriends } from "../../context/FriendsProvider";
import { useLogin } from "../../context/LoginProvider";
import { useUser } from "../../context/UserProvider";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { ModalContainer } from "../forms/ModalContainer";
import { NewPostForm } from "../forms/NewPostForm";
import { PostsList } from "../posts/PostsList";

export const Newsfeed = () => {
    const { is_banned : isBanned , is_admin : isAdmin} = useLogin()
    const { isFriend } = useFriends()
    const { isOwner } = useUser()
    const [isOpen, setIsOpen] = useState(false)

    const toggleModal = () => {
        setIsOpen(!isOpen)
    }
    return (
        <div className="container-flex-column card-round margin-top-m full-width">
            <div className="container-flex-row full-width">
                <h2 className="ff-heading fs-l fw-bold text-gradient full-width">
                    Feed
                </h2>
                {
                    (
                        //renderinng button if admin or owner or friend and  not banned 
                        !isBanned
                        ||
                        isAdmin
                    )
                    &&
                    <SecondaryButton text={"New post"} onClick={toggleModal}/>
                }
            </div>
            <PostsList />
            <ModalContainer isOpen={isOpen}>
                <NewPostForm onSubmit={toggleModal}/>
                <div className="container-flex-column margin-top-m">
                    <SecondaryButton text={'Cancel'} onClick={toggleModal}/>
                </div>
            </ModalContainer>
        </div>
    );
};
