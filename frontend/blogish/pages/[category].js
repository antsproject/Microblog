import Layout from "../components/Layout";
import React, {useEffect, useState} from "react";
import PostRequests from "../api/requests/Posts";
import Post from "../components/Post";
import {useSelector, useDispatch} from "react-redux";
import {setLikeSlice} from "../redux/slices/likeSlice";
import {setFavoriteSlice} from "../redux/slices/favoriteSlice";
import {useRouter} from "next/router";

export default function Category() {
    const categories = useSelector((state) => state.category.value);
    const router = useRouter();
    const categoryName = router.query.category;
    const [results, setResults] = useState([]);
    const [likesFromUser, setLikes] = useState([]);
    const [favoriteFromUser, setFavorite] = useState([]);
    const currentUser = useSelector((state) => state.user.value);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 2;
    const category = categories.find((cat) => cat.name === categoryName);

    useEffect(() => {
        if (category) {
            PostRequests.GetByCategory(category.id, function (success, response) {
                if (success === true) {
                    setResults(response.data.results);
                }
            });
        }
    }, [router.query, categories]);

    useEffect(() => {
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
        if (
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight
        ) {
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
        <Layout
            children={results
                .slice(0, currentPage * itemsPerPage)
                .map((post) =>
                    categories.map((cat) =>
                        post.category_id === cat.id ? (
                            <Post
                                key={post.id}
                                item={post}
                                category={cat.name}
                                isLiked={isPostLiked(post.id)}
                                isFavorite={isPostFavorite(post.id)}
                            />
                        ) : null
                    )
                )}
        />
    );
}
