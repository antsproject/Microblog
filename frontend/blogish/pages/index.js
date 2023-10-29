import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../session/session";
import React, { useState, useEffect } from 'react';
import CategoryRequests from '../api/requests/Category'
import PostRequests from "../api/requests/Posts";
import { useSelector } from "react-redux";
import { setCategories } from "../redux/slices/categorySlice";
import { useDispatch } from "react-redux";
import { setLikeSlice } from "../redux/slices/likeSlice";
import { setFavoriteSlice } from "../redux/slices/favoriteSlice";

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
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

export default function Home({ results }) {
    const [categories, setCategory] = useState([]);
    const [likesFromUser, setLikes] = useState([])
    const [favoriteFromUser, setFavorite] = useState([])
    const currentUser = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        const query = {}
        CategoryRequests.get(query, function (success, response) {
            if (success === true) {
                setCategory(response.data.results);
                dispatch(setCategories(response.data.results));
            }
        });
        if (currentUser && currentUser.id) {
            PostRequests.likeByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setLikes(response.data.results);
                    dispatch(setLikeSlice(response.data.results));
                }
            });
            PostRequests.favoriteByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setFavorite(response.data.results);
                    dispatch(setFavoriteSlice(response.data.results));

                }
            });
        }
    }, [currentUser]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [currentPage]);

    const isPostLiked = (postId) => {
        return likesFromUser.some((like) => like.post_id === postId);
    };

    const isPostFavorite = (postId) => {
        return favoriteFromUser.some((favorite) => favorite.post_id === postId);
    };
    const handleScroll = () => {
        if (loading || !hasMore) return;
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            setLoading(true);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const newData = results.slice(startIndex, endIndex);

            if (newData.length > 0) {
                setCurrentPage(currentPage + 1);
                setLoading(false);
            } else {
                setHasMore(false);
            }
        }
    };
    return (
        <Layout children={results
            .slice(0, currentPage * itemsPerPage)
            .map((post) => (
                categories.map((cat) => (
                    post.category_id === cat.id ? (
                        <Post key={post.id} item={post}
                            category={cat.name}
                            isLiked={isPostLiked(post.id)}
                            isFavorite={isPostFavorite(post.id)}
                        />
                    ) : null
                ))
            ))}
        />
    );
}






