import Profile from "../../components/Profile";
import Layout from "../../components/Layout";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../../session/session";
import Microservices from "../../api/Microservices";
import Endpoints from "../../api/Endpoints";
import Post from "../../components/Post";


export const getServerSideProps = withIronSessionSsr(async function ({req, query}) {
    const userId = query.userInfo ? query.userInfo.split('-', 1) : "0";
    const userSlug = query.userInfo ? query.userInfo.split('-').slice(1).join('-') : "";

    const res = await fetch(`${Microservices.Posts_server}${Endpoints.Posts.GetByUserID}${userId}/`);
    const resCat = await fetch(`${Microservices.Posts_server}${Endpoints.Category.Get}`);

    if (!res.ok) {
        throw new Error('Request failed with status ' + res.status);
    }
    if (!resCat.ok) {
        throw new Error('Request failed with status ' + resCat.status);
    }
    const posts = await res.json();
    const categories = await resCat.json();
    const results = posts.results;
    const resultsCat = categories.results;

    return {
        props: {
            userInfo: {userId: userId, userSlug: userSlug},
            results,
            resultsCat,
        },
    };
}, sessionOptions);


export default function ProfilePage(props) {
    return (
        <Layout>
            {[
                <Profile key="profile" {...props} />
            ]}
        </Layout>

    );
}