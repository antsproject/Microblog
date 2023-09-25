import {Link} from 'react-router-dom';
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
import ContentRenderer from './ContentRenderer';

// Нужен state, в котором будет лежать token, чтобы отправлять его на сервис posts.
// Данная функция работает без verify_token на сервере.
// Так же необходимо добавить отображение картинок, но на сервере posts их нет.

const Post = () => {
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
                <div key={item.id} className="newsblock">
                    <div className="newsblock-header">
                        <div className="newsblock-type">
                            <GlobeImg/> {item.category}
                        </div>
                        <div className="newsblock-author">
                            <AvatarImg/> {item.user_id}
                        </div>
                        <div className="newsblock-date">{item.created_at_fmt}</div>
                        <div className="newsblock-subscription">
                            <Link to="#">- Отписаться</Link>
                        </div>
                    </div>
                    <div className="newsblock-content">
                        <h2>{item.title}</h2>
                        <ContentRenderer content={item.content}/>
                    </div>
                    <div>
                        {item.image ? (
                            <img
                                src={item.image}
                                alt={item.title}
                                className="post-image"
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
export default Post;
