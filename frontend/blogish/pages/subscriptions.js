import Layout from "../components/Layout";
import Microservices from "../api/Microservices";
import Endpoints from "../api/Endpoints";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../session/session";
import SubscriptionsPostsLenta from "../components/SubscribersPosts";

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

export default function Page({results}) {
    return (
        <Layout>
            <SubscriptionsPostsLenta posts={results}/>
        </Layout>
    );
}

