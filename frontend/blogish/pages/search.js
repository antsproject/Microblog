import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import React, { useState, useEffect } from 'react';
// import CategoryRequests from '../api/requests/Category'
import PostRequests from "../api/requests/Posts";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PostsStruct from "../api/struct/Posts";


export default function SearchPage({ results }) {
    // const [pagedata, setPagedata] = useState([]);
    const [data, setData] = useState([]);
    const currentUser = useSelector((state) => state.user.value);
    const categories = useSelector((state) => state.category.value);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const text_search = router.query;

        let query = PostsStruct.search;
        query.s = text_search.s;

        PostRequests.search(query, function (success, response) {
            console.log(response);
            if (response.data != undefined) {
                console.log(response.data.results);
                if (response.data.results != null)
                    setData(response.data.results);
            }

        });
    }, [currentUser, router]);

    return (
        <Layout children={data.map((post) => (
            categories.map((cat) => (
                post.category_id === cat.id ? (
                    <Post key={post.id} item={post}
                        category={cat.name}

                    />) : null))
        ))} />
    );
}






