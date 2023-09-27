import React, {useState, useEffect} from 'react';
import {ReactComponent as AvatarImg} from '../../images/avatar.svg';
import {ReactComponent as PostImg} from '../../images/imagepost.svg';
import {ReactComponent as GlobeImg} from '../../images/globe-06.svg';
import {ReactComponent as LikeImg} from '../../images/heart.svg';
import {ReactComponent as CommentsImg} from '../../images/message-circle-01.svg';
import {ReactComponent as BookmarkImg} from '../../images/bookmark.svg';
import {ReactComponent as ReportImg} from '../../images/annotation-alert.svg';
import PostsStruct from '../../api/struct/Posts';
import PostRequests from '../../api/requests/Posts';
import postUtils from "../../features/postUtils";




const Lenta = () => {
    const [posts, setPost] = useState([]);

    useEffect(() => {
        console.debug('useEffect');
        PostRequests.get(PostsStruct.get, function (success, response) {
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
                            <GlobeImg/> {item.category_id}
                        </div>
                        <div className="newsblock-author">
                            <AvatarImg/> {item.user_id}
                        </div>
                        <div className="newsblock-date">{item.created_at_fmt}</div>
                        {/*<div className="newsblock-subscription">*/}
                        {/*    <Link to="#">Отписаться</Link>*/}
                        {/*</div>*/}
                    </div>
                    <div className="newsblock-content">
                        <h2>{item.title}</h2>
                        {/*<ContentRenderer content={item.content}/>*/}
                        <p>{JSON.parse(item.content).content[0].text}</p>
                    </div>
                    <div className="post-image">
                        {item.image ? (
                            <img
                                src={postUtils.getImage(item)}
                                alt={item.title}
                            />
                        ) : (
                            <PostImg/>)
                        }
                    </div>
                    <div className="newsblock-footer">
                        <div className="newsblock-footer__left">
                            <div className="newsblock-footer__cell">
                                <LikeImg/> 1200
                            </div>
                            <div className="newsblock-footer__cell">
                                <CommentsImg/> 65
                            </div>
                        </div>
                        <div className="newsblock-footer__right">
                            <ReportImg/>
                            <BookmarkImg/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};
export default Lenta;
