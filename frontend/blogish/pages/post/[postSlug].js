'use client';
import Layout from '../../components/Layout';
import {withIronSessionSsr} from 'iron-session/next';
import {sessionOptions} from '../../session/session';
import React, {useEffect, useState} from 'react';
import Comments from '../../components/Comments/Comments';
import {useDispatch, useSelector} from 'react-redux';
import Image from 'next/image';
import Microservices from '../../api/Microservices';
import Endpoints from '../../api/Endpoints';
import PostRenderer from '../../components/PostRenderer';
import Subscribing from '../../components/Subcribing';
import PostRendererEditor from '../../components/PostRendererEditor';
import PostRequests from '../../api/requests/Posts';
import {useRouter} from 'next/router';
import {setUsername} from '../../redux/slices/userSlice';
import Post from "../../components/Post";
import {setCategories} from "../../redux/slices/categorySlice";

export const getServerSideProps = withIronSessionSsr(async function ({req, query}) {
    console.log(query);
    return {
        props: {
            postSlug: query.postSlug,
        },
    };
}, sessionOptions);

export default function PostPage({postSlug}) {


    const categories = useSelector((state) => state.category.value);
    const commentCount = useSelector((state) => state.post.commentsCount);
    const currentUser = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);

    const [result, setResult] = useState([]);
    const [commentsActive, setCommentsActive] = useState(false);


    useEffect(() => {
        const data = {
            postId: postSlug,
        };
        PostRequests.get(data, function (success, response) {
            if (success === true) {
                setResult(response.data.data.post);
            }
        });
    }, [postSlug]);

    return (
        <Layout>
            <div>
                {categories.map((cat) => (
                    result.category_id === cat.id ? (
                        <Post key={result.id} item={result}
                              category={cat.name}
                            // isLiked={isPostLiked(post.id)}
                            // isFavorite={isPostFavorite(post.id)}
                        />
                    ) : null))}
                <div className='newscontainer-comment'>
                    <Comments
                        commentsActive={commentsActive}
                        setCommentsActive={setCommentsActive}
                        postIdProp={result.id}
                    />
                </div>
            </div>
        </Layout>
    );
}
