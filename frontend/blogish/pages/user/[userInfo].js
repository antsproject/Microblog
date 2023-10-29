import Profile from "../../components/Profile";
import Layout from "../../components/Layout";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "../../session/session";
import Microservices from "../../api/Microservices";
import Endpoints from "../../api/Endpoints";
import Post from "../../components/Post";


export const getServerSideProps = withIronSessionSsr(async function ({ req, query }) {
    const userId = query.userInfo ? query.userInfo.split('-', 1) : "0";
    const userSlug = query.userInfo ? query.userInfo.split('-').slice(1).join('-') : "";
    const token = req.session.token ? req.session.token : null;

    const headers = {
        'Authorization': `Bearer ${token}`,
    };

    const userByID = await fetch(`${Microservices.Users_server}${Endpoints.Users.Get}${userId}/`, {
        method: 'GET',
        headers: headers
    });

    const postsByID = await fetch(`${Microservices.Posts_server}${Endpoints.Posts.GetByUserID}${userId}/`);
    const resCat = await fetch(`${Microservices.Posts_server}${Endpoints.Category.Get}`);

    if (!postsByID.ok) {
        throw new Error('Request failed with status ' + postsByID.status);
    }
    if (!resCat.ok) {
        throw new Error('Request failed with status ' + resCat.status);
    }
    if (!userByID.ok) {
        throw new Error('Request failed with status ' + userByID.status);
    }

    const currentUser = await userByID.json();
    const posts = await postsByID.json();
    const categories = await resCat.json();
    const results = posts.results;
    const resultsCat = categories.results;

    return {
        props: {
            userInfo: { userId: userId, userSlug: userSlug },
            currentUser,
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