import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import PostRequests from "../api/requests/Posts";

export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    const res = await fetch(Microservices.Posts + Endpoints.Posts.Get);
    const resCat = await fetch(`${Microservices.Posts_server}${Endpoints.Category.Get}`);

    if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
    }
    if (!resCat.ok) {
        throw new Error('Request failed with status ' + resCat.status);
    }
    const posts = await res.json();
    const categories = await resCat.json();
    const results = posts.results;
    const resultsCat = categories.results;

    return {
        props: {
            user: req.session.user || null,
            token: req.session.token || null,
            results,
            resultsCat,
        },
    };
}, sessionOptions);

export default function New({results, user, token, resultsCat}) {
    const [likesFromUser, setLikes] = useState([])
    const currentUser = useSelector((state) => state.user.value);
    results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    useEffect(() => {
        if (currentUser && currentUser.id) {
            PostRequests.likeByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setLikes(response.data.results)
                }
            });
        }
    }, [currentUser]);

    const isPostLiked = (postId) => {
        return likesFromUser.some((like) => like.post_id === postId);
    };
    return (
        <Layout children={results.map((post) => (
            resultsCat.map((cat) => (
                post.category_id === cat.id ? (
                    <Post key={post.id} item={post} category={cat.name} isLiked={isPostLiked(post.id)}/>) : null))
        ))}
                user={user}
                token={token}
                centerHeader={
                    <div className="no-page-message-box">
                        <h2>Новые посты</h2>
                    </div>
                }
        />
    );
}
