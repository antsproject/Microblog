import Layout from '../../components/Layout';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../session/session';
import { useEffect, useState } from 'react';
import Comments from '../../components/Comments/Comments';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Microservices from '../../api/Microservices';
import Endpoints from '../../api/Endpoints';
import PostRenderer from '../../components/PostRenderer';
import Subscribing from '../../components/Subcribing';

export const getServerSideProps = withIronSessionSsr(async function ({ req, query }) {
    console.log(query);
    return {
        props: {
            category: query.category,
            postSlug: query.postSlug,
        },
    };
}, sessionOptions);

export default function PostPage({ category, postSlug }) {
    const [result, setResult] = useState({});
    const getPost = async () => {
        try {
            const res = await fetch(Microservices.Posts + Endpoints.Posts.Get + postSlug + '/');
            const posts = await res.json();
            setResult(posts.data.post);
        } catch (err) {
            console.log(err, 'error');
        }
    };
    useEffect(() => {
        getPost();
    }, []);
    const commentsCount = useSelector((state) => state.post.commentsCount);
    function ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }
    const categoryPost = ucFirst(category);
    const [commentsActive, setCommentsActive] = useState(false);
    const username = useSelector((state) => state.post.username);
    return (
        <Layout>
            {/* <p>Category: {category}</p>
            <p>Slug: {postSlug} (contains: ID + PostSlug) (Ex: 1-test-post-name)</p>
            <p>Example: http://localhost:3000/science/1-test-post-name</p> */}
            <div style={{ marginBottom: '200px' }} key={result.id} className="post ">
                <div className="post-header">
                    <div className="newsblock-type">
                        <Image
                            src="/images/globe-06.svg"
                            width={24}
                            height={24}
                            alt="category icon"
                        />{' '}
                        {categoryPost}
                    </div>
                    <div className="newsblock-author">
                        <Image
                            src="/images/avatar.svg"
                            width={24}
                            height={24}
                            alt="avatar author"
                        />{' '}
                        {username}
                    </div>
                    <div className="newsblock-date">{result.created_at_fmt}</div>
                    <div className="newsblock-subscription">
                        <Subscribing toUserId={result.user_id} post={true} />
                    </div>
                </div>
                <div className="newsblock-content">
                    <h2>{result.title}</h2>
                    <PostRenderer data={result.content} />
                </div>
                <div>
                    {result.image ? (
                        <Image
                            src={Microservices.Posts.slice(0, -1) + result.image}
                            alt={result.title}
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{ width: '100%', height: 'auto' }}
                            priority
                            unoptimized
                        />
                    ) : (
                        <Image
                            src="/images/imagepost.svg"
                            alt="default-image"
                            width={735}
                            height={330}
                            priority
                        />
                    )}
                </div>
                <div className="newsblock-footer">
                    <div className="newsblock-footer__left">
                        <div className="newsblock-footer__cell">
                            <Image src="/images/heart.svg" width={24} height={24} alt="heart" /> 0
                        </div>
                        <div
                            onClick={() => setCommentsActive(!commentsActive)}
                            className="newsblock-footer__cell"
                        >
                            <Image
                                src="/images/message-circle-01.svg"
                                width={24}
                                height={24}
                                alt="circle"
                            />{' '}
                            {commentsCount}
                        </div>
                    </div>
                    <div className="newsblock-footer__right">
                        <Image
                            src="/images/annotation-alert.svg"
                            width={24}
                            height={24}
                            alt="alert"
                        />
                        <Image src="/images/bookmark.svg" width={24} height={24} alt="bookmark" />
                    </div>
                </div>
                <Comments
                    commentsActive={commentsActive}
                    setCommentsActive={setCommentsActive}
                    postIdProp={result.id}
                    userId={result.user_id}
                />
            </div>
        </Layout>
    );
}
