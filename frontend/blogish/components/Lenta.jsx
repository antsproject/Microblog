import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import PostsStruct from '../api/struct/Posts';
import PostRequests from '../api/requests/Posts';
import ContentRenderer from './ContentRenderer';
import Link from "next/link";

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
                            <Image src="/images/globe-06.svg" width={24} height={24}/> {item.category_id}
                        </div>
                        <div className="newsblock-author">
                            <Image src="/images/avatar.svg" width={24} height={24}/> {item.user_id}
                        </div>
                        <div className="newsblock-date">{item.created_at_fmt}</div>
                        <div className="newsblock-subscription">
                            <Link href="#">Подписаться</Link>
                        </div>
                    </div>
                    <div className="newsblock-content">
                        <h2>{item.title}</h2>
                        <ContentRenderer content={item.content}/>

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
                                layout="responsive"
                            />
                        )}
                    </div>
                    <div className="newsblock-footer">
                        <div className="newsblock-footer__left">
                            <div className="newsblock-footer__cell">
                                <Image src="/images/heart.svg" width={24} height={24} alt="heart"/> 1200
                            </div>
                            <div className="newsblock-footer__cell">
                                <Image src="/images/message-circle-01.svg" width={24} height={24} alt="circle"/> 65
                            </div>
                        </div>
                        <div className="newsblock-footer__right">
                            <Image src="/images/annotation-alert.svg" width={24} height={24} alt="alert"/>
                            <Image src="/images/bookmark.svg" width={24} height={24} alt="bookmark"/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
export default Lenta;
