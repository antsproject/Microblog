import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import Post from "../components/Post";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../session/session";

// export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
//     const res = await fetch(`${Microservices.Posts}/${Endpoints.Posts.Get}`);
//     const posts = await res.json();
//     const results = posts.results;
//     return {
//         props: {
//             user: req.session.user ? req.session.user : null,
//             token: req.session.token ? req.session.token : null,
//             results,
//         },
//     };
// }, sessionOptions);


export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
    try {
        const res = await fetch(`${Microservices.Posts}/${Endpoints.Posts.Get}`);

        if (!res.ok) {
            throw new Error('Request failed with status ' + res.status);
        }

        const posts = await res.json();
        const results = posts.results;

        return {
            props: {
                // user: req.session.user || null,
                // token: req.session.token || null,
                results,
            },
        };
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Check if the server is running.');
        } else {
            console.error('An error occurred:', error.message);
        }

        return {
            props: {
                // user: req.session.user || null,
                // token: req.session.token || null,
                results: [],
                error: error.message,
            },
        };
    }
}, sessionOptions);

export default function Home({ results }) {
    return (
        <Layout children={results.map((post) => (<Post key={post.id} item={post} />))} />
    );
}
