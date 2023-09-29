import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../session/session";

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
    const res = await fetch(`${Microservices.Posts}/${Endpoints.Posts.Get}`);
    const posts = await res.json();
    const results = posts.results;
    return {
        props: {
            user: req.session.user ? req.session.user : null,
            token: req.session.token ? req.session.token : null,
            results,
        },
    };
}, sessionOptions);


export default function Home({ results, user, token }) {
    return (
        <Layout children={results.map((post) => (
            <Post item={post} />
        ))} user={user} token={token} />
    );
}
