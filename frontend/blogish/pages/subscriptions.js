import Layout from "../components/Layout";
import Microservices from "../api/Microservices";
import Endpoints from "../api/Endpoints";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../session/session";
import SubscriptionsPostsLenta from "../components/SubscribersPosts";

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
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

export default function Page({results}) {
    return (
        <Layout>
            <SubscriptionsPostsLenta posts={results}/>
        </Layout>
    );
}

