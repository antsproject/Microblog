import Profile from "../../components/Profile";
import Layout from "../../components/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../session/session";


export const getServerSideProps = withIronSessionSsr(async function ({ req, query }) {
    return {
        props: {
            userInfo: query.userInfo,
        },
    };
}, sessionOptions);


export default function ProfilePage({ userInfo }) {
    return (
        <Layout children={<Profile userInfo={userInfo} />}></Layout>
    );
}