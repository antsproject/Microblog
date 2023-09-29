import React, { useState, useEffect } from 'react';
// import PostsStruct from '../api/struct/Posts';
// import PostRequests from '../api/requests/Posts';
import Post from './Post';

const Lenta = ({ posts }) => {
    // const [posts, setPost] = useState([]);
    // useEffect(() => {
    //     PostRequests.get(PostsStruct.get, function (success, response) {
    //         console.debug("PostRequests");
    //         if (success === true) {
    //             setPost(response.data.results);
    //         }
    //     });
    // }, []);

    console.debug(posts);

    return (
        <>
            {posts.forEach((post) => (
                <Post item={post} />
            ))}
            {/* {posts.map((item) => (
                <Post item={item}/>
            ))} */}
        </>
    );
};
export default Lenta;
