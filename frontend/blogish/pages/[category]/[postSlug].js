'use client';
import Layout from '../../components/Layout';
import { withIronSessionSsr } from 'iron-session/next';
import { sessionOptions } from '../../session/session';
import React, { useEffect, useState } from 'react';
import Comments from '../../components/Comments/Comments';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Microservices from '../../api/Microservices';
import Endpoints from '../../api/Endpoints';
import PostRenderer from '../../components/PostRenderer';
import Subscribing from '../../components/Subcribing';
import PostRendererEditor from '../../components/PostRendererEditor';
import PostRequests from '../../api/requests/Posts';
import { useRouter } from 'next/router';
import { setUsername } from '../../redux/slices/userSlice';

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
    const commentCount = useSelector((state) => state.post.commentsCount);
    const currentUser = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);

    const [isDeleteClicked, setIsDeleteClicked] = useState(false);
    const [buttonText, setButtonText] = useState('Удалить');
    const [result, setResult] = useState({});
    const [commentsActive, setCommentsActive] = useState(false);

    const router = useRouter();
    const isContentEditable = result.content && result.content.time !== undefined;
    const categoryPost = ucFirst(category);

    const getPost = async () => {
        try {
            const res = await fetch(
                Microservices.Posts + Endpoints.Posts.GetByPostId + postSlug + '/',
            );

            const posts = await res.json();
            setResult(posts.data.post);
        } catch (err) {
            console.log(err, 'error');
        }
    };
    useEffect(() => {
        getPost();
    }, []);
    const handleDelete = (item) => {
        if (isDeleteClicked) {
            return;
        }

        const confirmation = window.confirm('Are you sure you want to delete this post?');
        if (!confirmation) {
            return;
        }

        PostRequests.delete(item.id, token.access, (success, response) => {
            if (success) {
                console.log('Post deleted successfully.');
                setIsDeleteClicked(true);
                setButtonText('Пост удалён!');
            } else {
                console.error('Error deleting post:', response);
            }
        });
    };

    const handleEditClick = () => {
        if (!currentUser || item.user_id !== currentUser.id) {
            return;
        }

        if (!isDeleteClicked) {
            router
                .push({
                    pathname: '/edit',
                    query: {
                        postId: item.id,
                    },
                })
                .then((r) => true);
        }
    };

    function ucFirst(str) {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    }

    return (
        <Layout>
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
                        {result.user?.username}
                    </div>
                    <div className="newsblock-date">{result.created_at_fmt}</div>
                    <div className="newsblock-subscription">
                        <Subscribing toUserId={result.user_id} post={true} />
                    </div>
                </div>
                <div className="newsblock-content">
                    <h2>{result.title}</h2>
                    {isContentEditable ? (
                        <PostRendererEditor data={result.content} />
                    ) : (
                        <PostRenderer data={result.content} />
                    )}
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
                            {commentCount}
                        </div>
                    </div>
                    <div className="newsblock-footer__right">
                        {currentUser && result.user_id === currentUser.id ? (
                            <div className="newsblock-footer__right">
                                {!isDeleteClicked && (
                                    <button
                                        className={`inline ${
                                            isDeleteClicked
                                                ? 'btn-red deactivate'
                                                : 'btn-red edit-post__btn'
                                        }`}
                                        onClick={handleEditClick}
                                    >
                                        Редактировать
                                    </button>
                                )}
                                <button
                                    className={`inline ${
                                        isDeleteClicked ? 'btn-red deactivate' : 'btn-red'
                                    }`}
                                    onClick={() => handleDelete(result)}
                                >
                                    {buttonText}
                                </button>
                            </div>
                        ) : (
                            <Image
                                src="/images/annotation-alert.svg"
                                width={24}
                                height={24}
                                alt="alert"
                            />
                        )}
                        <Image src="/images/bookmark.svg" width={24} height={24} alt="bookmark" />
                    </div>
                </div>
                <Comments
                    commentsActive={commentsActive}
                    setCommentsActive={setCommentsActive}
                    postIdProp={result.id}
                />
            </div>
        </Layout>
    );
}
