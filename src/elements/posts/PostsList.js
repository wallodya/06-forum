import React from "react";
import { Post } from "./Post";
import { getPostsForUser } from "../../api/api";
import { useQuery } from "react-query";
import { useUser } from "../../context/UserProvider";

export const PostsList = () => {
    const { userOwner : { uuid } } = useUser()

    const {isLoading, isError, error, data:posts} = useQuery(['posts', uuid], () => {
        if (!isNaN(uuid)) {
            return getPostsForUser(uuid)
        } else {
            return getPostsForUser(0)
        }
    })

    return (
        <div className="container-grid-auto-columns full-width">
            {
                isLoading
                    ? <h1>Loading...</h1>
                    : isError
                    ? <h1>Error: {error}</h1>
                    : posts.map(post => <Post key={post.id} post={post} />)
            }
        </div>
    );
};


