import Layout from "../components/Layout";
import dynamic from 'next/dynamic';
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../session/session";

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
    return {
        props: {
            user: req.session.user ? req.session.user : null,
            token: req.session.token ? req.session.token : null,
        },
    };
}, sessionOptions);

export default function Page({ user, token }) {
    const CreatePost = dynamic(import('../components/PostCreate'), {ssr: false})
    return (
        <Layout user={user} token={token}>
            <CreatePost/>
        </Layout>
    );
}

