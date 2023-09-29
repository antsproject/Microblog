import User from "../../components/User";
import Layout from "../../components/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../session/session";
import { withSessionRoute } from "../../session/withSession";
import { getIronSession } from "iron-session";

export async function getServerSideProps(req, res) {
    const { userInfo } = req.query;
    const session = await getIronSession(req, res, sessionOptions);
    // const user = req.session.user ? req.session.user : null;
    return {
        props: {
            userInfo,
            user 
        },
    };
}


export default function Profile({ userInfo, user }) {
    return (
        <Layout user={user}>
            <User userInfo={userInfo} />
        </Layout>
    );
}