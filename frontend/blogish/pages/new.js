import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import PostRequests from "../api/requests/Posts";
import {setCategories} from "../redux/slices/categorySlice";
import {setFavoriteSlice} from "../redux/slices/favoriteSlice";
import {setLikeSlice} from "../redux/slices/likeSlice";

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
    const [favoriteFromUser, setFavorite] = useState([])
    const currentUser = useSelector((state) => state.user.value);
    const sortedResults = [...results];
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 2;
    sortedResults.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    useEffect(() => {
        if (currentUser && currentUser.id) {
            PostRequests.likeByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setLikes(response.data.results)
                    dispatch(setLikeSlice(response.data.results));

                }
            });
            PostRequests.favoriteByUser(currentUser.id, function (success, response) {
                if (success === true) {
                    setFavorite(response.data.results)
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
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
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
        <Layout children={sortedResults.slice(0, currentPage * itemsPerPage).map((post) => (
            resultsCat.map((cat) => (
                post.category_id === cat.id ? (
                    <Post key={post.id} item={post}
                          category={cat.name}
                          isLiked={isPostLiked(post.id)}
                          isFavorite={isPostFavorite(post.id)}/>) : null))
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
