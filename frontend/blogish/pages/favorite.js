import Layout from "../components/Layout";
import React, {useEffect, useState} from "react";
import CategoryRequests from "../api/requests/Category";
import PostRequests from "../api/requests/Posts";
import Post from "../components/Post";
import {withIronSessionSsr} from "iron-session/next";
import Microservices from "../api/Microservices";
import Endpoints from "../api/Endpoints";
import {sessionOptions} from "../session/session";
import {useSelector} from "react-redux";

export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    const resCat = await fetch(`${Microservices.Posts_server}${Endpoints.Category.Get}`);

    if (!resCat.ok) {
        throw new Error('Request failed with status ' + resCat.status);
    }
    const categories = await resCat.json();
    const resultsCat = categories.results;

    return {
        props: {
            user: req.session.user || null,
            token: req.session.token || null,
            resultsCat,
        },
    };
}, sessionOptions);


export default function Favorite({user, token, resultsCat}) {
    const [results, setResults] = useState([]);
    const currentUser = useSelector((state) => state.user.value);
    const [currentPage, setCurrentPage] = useState(1); // Track the current page
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 2;

    useEffect(() => {
        if (currentUser && currentUser.id) {
            PostRequests.favoritePosts(currentUser.id, function (success, response) {
                if (success === true) {
                    setResults(response.data.results)
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
        <Layout>
            {currentUser && currentUser.id ? (
                results.slice(0, currentPage * itemsPerPage).map((post) => (
                    resultsCat.map((cat) => (
                        post.category_id === cat.id ? (
                            <Post
                                key={post.id}
                                item={post}
                                category={cat.name}
                                isLiked={post.liked}
                                isFavorite={post.favorite}
                            />
                        ) : null
                    ))
                ))
            ) : (
                <div className="no-page-message-box">
                    <h2>Войдите в аккаунт!</h2>
                    <p>Вы увидите здесь избранные вами посты</p>
                </div>
            )}
        </Layout>
    );
}

