import Image from 'next/image';
import PostRenderer from './PostRenderer';
import PostSubscribing from './PostSubcribing';
import Comments from './Comments';
import React, { useState, useEffect } from 'react';
import UserRequests from '../api/requests/Users'
import UsersStruct from '../api/struct/Users'
export default function Post({ item, category }) {
    const [commentsActive, setCommentsActive] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [username, setUsername] = useState('');

    useEffect(() => {
    let query = UsersStruct.get;
    query.userId = item.user_id;
    const response_categories = UserRequests.get(query, function (success, response) {
        if (success === true) {
        setUsername(response.data.username)
        }
    });
    }, []);

    return (
        <div key={item.id} className="post">
            <div className="post-header">
                <div className="newsblock-type">
                    <Image src="/images/globe-06.svg" width={24} height={24} alt="category icon" />{' '}
                    {category}
                </div>
                <div className="newsblock-author">
                    <Image src="/images/avatar.svg" width={24} height={24} alt="avatar author" />{' '}
                    {username}
                </div>
                <div className="newsblock-date">{item.created_at_fmt}</div>
                <div className="newsblock-subscription">
                    <PostSubscribing />
                </div>
            </div>
            <div className="newsblock-content">
                <h2>{item.title}</h2>
                <PostRenderer data={item.content} />
            </div>
            <div className="post-image img">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.title}
                        width={735}
                        height={330}
                        layout="responsive"
                    />
                ) : (
                    <Image
                        src="/images/imagepost.svg"
                        alt="default-image"
                        width={735}
                        height={330}
                        // Add priority for this default image, because it LCP
                        // https://nextjs.org/docs/pages/api-reference/components/image#priority
                        priority
                    />
                )}
            </div>
            <div className="newsblock-footer">
                <div className="newsblock-footer__left">
                    <div className="newsblock-footer__cell">
                        <Image src="/images/heart.svg" width={24} height={24} alt="heart" /> 1200
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
                    <Image src="/images/annotation-alert.svg" width={24} height={24} alt="alert" />
                    <Image src="/images/bookmark.svg" width={24} height={24} alt="bookmark" />
                </div>
            </div>
            <Comments
                commentsActive={commentsActive}
                setCommentCount={setCommentCount}
                commentCount={commentCount}
            />
        </div>
    );
}
