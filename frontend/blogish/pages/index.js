import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import React, {useState, useEffect} from 'react';
import CategoryRequests from '../api/requests/Category'

export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    try {
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
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Check if the server is running.');
        } else {
            console.error('[BACKEND][INDEX.JS][POSTS] An error occurred:', error.message);
        }

        return {
            props: {
                results: [],
                error: error.message,
            },
        };
    }
}, sessionOptions);

export default function Home({results}) {
    const [categories, setCategory] = useState([]);
    useEffect(() => {
        const query = {}
        CategoryRequests.get(query, function (success, response) {
            if (success === true) {
                setCategory(response.data.results)
            }
        });
    }, []);

    return (
        <Layout children={results.map((post) => (
            categories.map((cat) => (
                post.category_id === cat.id ? (
                    <Post key={post.id} item={post} category={cat.name} category_id={cat.id}/>) : null))
        ))}/>
    );
}
