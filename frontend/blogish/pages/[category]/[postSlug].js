import Layout from '../../components/Layout';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../session/session';
import { useState } from 'react';
import Comments from '../../components/Comments/Comments';

export const getServerSideProps = withIronSessionSsr(async function ({ req, query }) {
    return {
        props: {
            category: query.category,
            postSlug: query.postSlug,
        },
    };
}, sessionOptions);

export default function PostPage({ category, postSlug }) {
    const [commentsActive, setCommentsActive] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    return (
        <Layout>
            <p>Category: {category}</p>
            <p>Slug: {postSlug} (contains: ID + PostSlug) (Ex: 1-test-post-name)</p>
            <p>Example: http://localhost:3000/science/1-test-post-name</p>
            <Comments
                commentsActive={commentsActive}
                setCommentCount={setCommentCount}
                commentCount={commentCount}
                setCommentsActive={setCommentsActive}
            />
        </Layout>
    );
}
