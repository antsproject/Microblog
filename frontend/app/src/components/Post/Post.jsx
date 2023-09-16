import { Link } from 'react-router-dom';

import { ReactComponent as AvatarImg } from '../../images/avatar.svg';
import { ReactComponent as PostImg } from '../../images/imagepost.svg';
import { ReactComponent as GlobeImg } from '../../images/globe-06.svg';
import { ReactComponent as LikeImg } from '../../images/heart.svg';
import { ReactComponent as CommentsImg } from '../../images/message-circle-01.svg';
import { ReactComponent as BookmarkImg } from '../../images/bookmark.svg';
import { ReactComponent as ReportImg } from '../../images/annotation-alert.svg';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Нужен state, в котором будет лежать token, чтобы отправлять его на сервис posts.
// Данная функция работает без verify_token на сервере.
// Так же необходимо добавить отображение картинок, но на сервере posts их нет.


const Post = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/posts')
        .then(response => {
            setData(response.data.posts);
            })
            .catch(err =>{
            console.log(err, 'error')
            });
        }, []);
  return (
  <div>
    {data.map(item => (
    <div className="newsblock">
      <div className="newsblock-header">
        <div className="newsblock-type">
          <GlobeImg /> Маркетинг
        </div>
        <div className="newsblock-author">
          <AvatarImg /> {item.username}
        </div>
        <div className="newsblock-date">{item.created_at}</div>
        <div className="newsblock-subscription">
          <Link to="#">- Отписаться</Link>
        </div>
      </div>
      <div className="newsblock-content">
        <h2>{item.title}</h2>
        <p>
          {item.content}
        </p>
      </div>
      <div>
        <PostImg />
      </div>
      <div className="newsblock-footer">
        <div className="newsblock-footer__left">
          <div className="newsblock-footer__cell">
            <LikeImg /> 1200
          </div>
          <div className="newsblock-footer__cell">
            <CommentsImg /> 65
          </div>
        </div>
        <div className="newsblock-footer__right">
          <ReportImg />
          <BookmarkImg />
        </div>
      </div>
    </div>
    ))}
    </div>
  );
};
export default Post;
