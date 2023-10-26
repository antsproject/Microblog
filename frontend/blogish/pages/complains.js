import Layout from "../components/Layout";
import Endpoints from "../api/Endpoints";
import Microservices from "../api/Microservices";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import ComplainsOnPosts from "../components/ComplainsPage";


export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    const user = req.session.user ? req.session.user : null

    const headers = {
        'IsSuperuser': false,
    };
    if (user) {
        headers.IsSuperuser = user.is_superuser
    }

    const complainsPostsRequest = await fetch(Microservices.Support + Endpoints.Supports.GetComplainPost, {
        method: 'GET',
        headers: headers
    });
    
    const complainsRequest = await fetch(Microservices.Support + Endpoints.Supports.GetComplain);
    
    if (!complainsPostsRequest.ok) {
        throw new Error('Request failed with status ' +  complainsPostsRequest.status);
    }
    if (!complainsRequest.ok) {
        throw new Error('Request failed with status ' + complainsRequest.status);
    }
    const complainsToPostsJson = await complainsPostsRequest.json(); 
    const complainsJson = await complainsRequest.json();
    const complainsPosts = complainsToPostsJson.results;
    const complains = complainsJson.results;

    return {
        props: {
            complainsPosts,
            complains,
        }
    }        
}, sessionOptions);

export default function ComplainsToPosts({complainsPosts, complains}) {
    return (
        <Layout>
            {complainsPosts.map((complain) => (<ComplainsOnPosts data={complain} complains={complains}/>))}
        </Layout>
    )
}
