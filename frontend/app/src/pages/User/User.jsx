import './User.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ReactComponent as PlusButton } from './images/plus.svg';
import { Link } from 'react-router-dom';
import UserRequests from '../../api/requests/Users';
import UsersStruct from '../../api/struct/Users';
import Nopage from '../../pages/Nopage';
import userUtils from '../../features/userUtils';
import SubscribersRequests from '../../api/requests/Subscribers';

const User = () => {
  let { userInfo } = useParams();
  const [user, setUser] = useState(null);
  const [subscribers, setSubscribers] = useState({});
  const userId = userInfo.split('-', 1);
  const userSlug = userInfo.split('-').slice(1).join('-');

  useEffect(() => {
    let query = UsersStruct.get;
    query.userId = userId;
    query.userSlug = userSlug;
    UserRequests.get(query, function (success, response) {
      if (success === true) {
        setUser(response.data);
        SubscribersRequests.getUserSubscribers(query, function (success, response) {
          if (success === true) {
            setSubscribers(response.data);
          }
        });
      }
    });
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className="whitebox profile-main">
            <div className="profile-columns">
              <div className="profile-avatar">
                <img src={userUtils.getAvatar(user)} alt="avatar" />
                <p className="profile-rating">+890973</p>
                <p>Рейтинг</p>
              </div>
              <div className="profile-info">
                <h1>{user.username}</h1>
                {/* <p>userId: { userId }, userSlug: { userSlug }</p> */}
                <p className="profile-group">Редактор</p>
                <p className="profile-status">{user.status}</p>
              </div>
              <div className="profile-subscribe">
                {/* deactivate */}
                <Link className="btn-red" to="#">
                  <PlusButton /> Подписаться
                </Link>
                <div className="profile-subscribe__stats">
                  <span>{subscribers.count}</span> подписчиков
                </div>
              </div>
            </div>
            <div className="profile-controls">
              <div className="profile-filters">
                <Link to="#">Статьи</Link>
                <Link to="#">Комментарии</Link>
              </div>
              <p>На проекте с {user.date_joined}</p>
            </div>
          </div>
          <div className="profile-posts__controls">
            <Link to="#">Популярное</Link>
            <Link to="#" className="active">
              Свежее
            </Link>
          </div>
        </>
      ) : (
        <Nopage />
      )}
    </>
  );
};

export default User;
