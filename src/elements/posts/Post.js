import React from "react";
import { SecondaryButton } from "../buttons/SecondaryButton";
import './posts.css'
import default_post_pic from './default_post.png'
import { useUser } from "../../context/UserProvider";
import { useLogin } from "../../context/LoginProvider";
import { useMutation, useQueryClient } from "react-query";
import { deletePost } from "../../api/api";

export const Post = ({post}) => {
    const queryClient = useQueryClient()
    const { login : loginClient, is_admin : isAdmin } = useLogin()
    const { userOwner : { uuid } } = useUser()

    const { mutate : handlePostDelete } = useMutation(() => deletePost(post.id), {
        onSuccess: () => {
            queryClient.invalidateQueries(['posts', uuid])
        }
    })

    return (
        <div className={ 
                loginClient === post.user_login
                    ? "container-flex-column card-round-post full-width border-accent"
                    : "container-flex-column card-round-post full-width"
        }>
            <Image src={post.post_image}/>            
            <Author author={post.user_login} isAdmin={post.is_admin}/>
            <Text text={post.post_text}/>
            <div className="container-flex-row margin-top-auto">
                <TimePosted time={post.time_posted}/>
                {
                    isAdmin
                    &&
                    <SecondaryButton text={"Delete"} onClick={handlePostDelete}/>
                }
                
            </div>
        </div>
    );
};


const TimePosted = ({ time }="posted recently") => {
    time = new Date(time).toLocaleString('en-us')
    return (
        <p className="text-primary-60 fw-bold fs-s">
            {time}
        </p>
    )
}

const Text = ({text}="") => {
    return (
        <p className="text-primary-100 fw-light margin-bottom-m">
            {text}
        </p>
    )
}

const Author = ({author, isAdmin}) => {
    return (
        <p 
            className={
                isAdmin
                    ? "text-gradient fw-bold margin-top-m"
                    : "text-primary-100 fw-bold margin-top-m"
            }
        >
            {author}
        </p>
    )
}

const Image = ({src}) => {
    return (
        <img
            src={src === "../lib/img/default_post.png" ? default_post_pic : src}
            className="post-image"
            alt="post_image"
        />
    )
}