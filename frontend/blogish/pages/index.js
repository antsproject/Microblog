import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import React, {useState, useEffect} from 'react';
import CategoryRequests from '../api/requests/Category'
import PostRequests from "../api/requests/Posts";
import {useSelector} from "react-redux";

export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    const res = await fetch(Microservices.Posts_server + Endpoints.Posts.Get);

    if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
    }

    const posts = await res.json();
    const results = posts.results;

    return {
        props: {
            results,
        },
    };
}, sessionOptions);

export default function Home({results}) {
    const [categories, setCategory] = useState([]);
    const [likesFromUser, setLikes] = useState([])
    const [favoriteFromUser, setFavorite] = useState([])
    const currentUser = useSelector((state) => state.user.value);
    useEffect(() => {
        const query = {}
        CategoryRequests.get(query, function (success, response) {
            if (success === true) {
                setCategory(response.data.results)
            }
        });
        if (currentUser && currentUser.id) {
            PostRequests.likeByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setLikes(response.data.results)
                }
            });
            PostRequests.favoriteByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setFavorite(response.data.results)
                }
            });
        }
    }, [currentUser]);

    const isPostLiked = (postId) => {
        return likesFromUser.some((like) => like.post_id === postId);
    };

    const isPostFavorite = (postId) => {
        return favoriteFromUser.some((favorite) => favorite.post_id === postId);
    };

    return (
        <Layout children={results.map((post) => (
            categories.map((cat) => (
                post.category_id === cat.id ? (
                    <Post key={post.id} item={post}
                          category={cat.name}
                          isLiked={isPostLiked(post.id)}
                          isFavorite={isPostFavorite(post.id)}/>) : null))
        ))}/>
    );
}






