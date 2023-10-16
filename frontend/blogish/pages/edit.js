import Layout from "../components/Layout";
import {withIronSessionSsr} from "iron-session/next";
import {sessionOptions} from "../session/session";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";

export const getServerSideProps = withIronSessionSsr(async function ({req}) {
    return {
        props: {
            user: req.session.user ? req.session.user : null,
            token: req.session.token ? req.session.token : null,
        },
    };
}, sessionOptions);


export default function Page() {
    const router = useRouter(); // Initialize the router
    const PostEdit = dynamic(import('../components/PostEdit'), {ssr: false})
    const postId = router.query.postId;

    return (
        <Layout>
            <PostEdit
                postId={postId}
            />
        </Layout>
    );
}
