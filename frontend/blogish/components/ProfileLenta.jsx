import Post from './Post';
import React from "react";

const ProfileLenta = ({posts, categories}) => {
    return (
        posts.map((post) => (
            categories.map((cat) => (
                post.category_id === cat.id ? (
                    <Post key={post.id} item={post} category={cat.name} isLiked={post.liked}/>) : null))
        ))
    )

};

export default ProfileLenta;
