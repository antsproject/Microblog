import Profile from "../../components/Profile";
import Layout from "../../components/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../session/session";


export const getServerSideProps = withIronSessionSsr(async function ({ req, query }) {
    return {
        props: {
            category: query.category,
            postSlug: query.postSlug,
        },
    };
}, sessionOptions);


export default function ProfilePage({ category, postSlug }) {
    return (
        <Layout>
            <p>Category: { category }</p>
            <p>Slug: { postSlug } (contains: ID + PostSlug) (Ex: 1-test-post-name)</p>
            <p>Example: http://localhost:3000/science/1-test-post-name</p>
        </Layout>
    );
}