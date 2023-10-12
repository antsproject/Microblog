import Image from 'next/image';
import PostRenderer from './PostRenderer';
import Subscribing from './Subcribing';
import Comments from './Comments/Comments';
import React, { useState, useEffect } from 'react';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Link from 'next/link';
import Microservices from '../api/Microservices';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername } from '../redux/slices/postSlice';

export default function Post({ item, category }) {
    const commentsCount = useSelector((state) => state.post.commentsCount);
    const [isLoading, setIsLoading] = useState(true);
    const username = useSelector((state) => state.post.username);
    const dispatch = useDispatch();
    const pathCategory = category ? category.toLowerCase() : category;
    useEffect(() => {
        let query = UsersStruct.get;

        query.userId = item.user_id;
        UserRequests.get(query, function (success, response) {
            setIsLoading(false);
            if (success === true) {
                dispatch(setUsername(response.data.username));
            }
        });
    }, []);

    return isLoading ? (
        <div key={item.id} className="post">
            <Skeleton width={735} height={500} />
        </div>
    ) : (
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
                    <Subscribing toUserId={item.user_id} post={true} />
                </div>
            </div>
            <Link
                style={{ textDecoration: 'none', color: 'inherit' }}
                href={`${pathCategory}/${item.id}`}
            >
                <div className="newsblock-content">
                    <h2>{item.title}</h2>
                    <PostRenderer data={item.content} />
                </div>
                <div>
                    {item.image ? (
                        <Image
                            src={Microservices.Posts.slice(0, -1) + item.image}
                            alt={item.title}
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
            </Link>
            <div className="newsblock-footer">
                <div className="newsblock-footer__left">
                    <div className="newsblock-footer__cell">
                        <Image src="/images/heart.svg" width={24} height={24} alt="heart" /> 0
                    </div>
                    <Link
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        href={`${category}/${item.id}`}
                    >
                        <div
                            // onClick={() => setCommentsActive(!commentsActive)}
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
                    </Link>
                </div>
                <div className="newsblock-footer__right">
                    <Image src="/images/annotation-alert.svg" width={24} height={24} alt="alert" />
                    <Image src="/images/bookmark.svg" width={24} height={24} alt="bookmark" />
                </div>
            </div>
        </div>
    );
}
