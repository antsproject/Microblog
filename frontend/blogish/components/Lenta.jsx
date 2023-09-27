// import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
// import {ReactComponent as AvatarImg} from '../images/avatar.svg';
// import {ReactComponent as PostImg} from '../images/imagepost.svg';
// import {ReactComponent as GlobeImg} from '../images/globe-06.svg';
// import {ReactComponent as LikeImg} from '../images/heart.svg';
// import {ReactComponent as CommentsImg} from '../images/message-circle-01.svg';
// import {ReactComponent as BookmarkImg} from '../images/bookmark.svg';
// import {ReactComponent as ReportImg} from '../images/annotation-alert.svg';
import PostsStruct from '../api/struct/Posts';
import PostRequests from '../api/requests/Posts';
import ContentRenderer from './ContentRenderer';
import postUtils from "../features/postUtils";

const Lenta = () => {
    const [posts, setPost] = useState([]);

    useEffect(() => {
        console.debug('useEffect');
        PostRequests.get(PostsStruct.get, function (success, response) {
            console.debug("PostRequests");
            if (success === true) {
                setPost(response.data.results);
            }
        });
    }, []);

    return (
        <>
            {posts.map((item) => (
                <div key={item.id} className="post">
                    <div className="post-header">
                        <div className="newsblock-type">
                            <Image src="/images/globe-06.svg" width={24} height={24} /> {item.category}
                        </div>
                        <div className="newsblock-author">
                            <Image src="/images/avatar.svg" width={24} height={24} /> {item.user_id}
                        </div>
                        <div className="newsblock-date">{item.created_at_fmt}</div>
                        {/*<div className="newsblock-subscription">*/}
                        {/*    <Link to="#">Отписаться</Link>*/}
                        {/*</div>*/}
                    </div>
                    <div className="newsblock-content">
                        <h2>{item.title}</h2>
                        {/* <ContentRenderer content={item.content} /> */}
                    </div>
                    <div className="post-image">
                        {item.image ? (
                            <Image
                                src={postUtils.getImage(item)}
                                alt={item.title}
                                width={735} height={330}
                            />
                        ) : (
                            <Image src="/images/imagepost.svg" width={735} height={330} />)
                        }
                    </div>
                    <div className="newsblock-footer">
                        <div className="newsblock-footer__left">
                            <div className="newsblock-footer__cell">
                                <Image src="/images/heart.svg" width={24} height={24} /> 1200
                            </div>
                            <div className="newsblock-footer__cell">
                                <Image src="/images/message-circle-01.svg" width={24} height={24} /> 65
                            </div>
                        </div>
                        <div className="newsblock-footer__right">
                            <Image src="/images/annotation-alert.svg" width={24} height={24} />
                            <Image src="/images/bookmark.svg" width={24} height={24} />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
export default Lenta;
