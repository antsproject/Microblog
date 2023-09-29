import React, { useState, useEffect } from 'react';
import PostsStruct from '../api/struct/Posts';
import PostRequests from '../api/requests/Posts';

import Post from './Post';

const Lenta = () => {
    const [posts, setPost] = useState([]);

    useEffect(() => {
        console.debug('useEffect');
        PostRequests.get(PostsStruct.get, function (success, response) {
            console.debug('PostRequests');
            if (success === true) {
                setPost(response.data.results);
            }
        });
    }, []);

    return (
        <>
            {posts.map((item) => (
                <Post key={item.id} item={item} />
            ))}
        </>
    );
};
export default Lenta;
