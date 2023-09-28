import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import SubscribesStruct from '../api/struct/Subscribes';
import Nopage from './Nopage';
import SubscribersRequests from '../api/requests/Subscribers';
import Microservices from '../api/Microservices';
import { useSelector } from 'react-redux';




const User = ({userInfo}) => {
  const currentUser = useSelector((state) => state.global.data.user);
  const [subscribers, setSubscribers] = useState({});
  const [user, setUser] = useState(null);
  const [isSubscribed, setSubscribe] = useState(false);
  const userId = userInfo ? userInfo.split('-', 1) : "0";
  const userSlug = userInfo ? userInfo.split('-').slice(1).join('-') : "";

// check subscribe status on future
//  toggleSubscribed() { setIsSubscribed(false) ? IsSubscribed  :  setIsSubscribed(true);  }


  const handleSubscribe = (e) => {
    e.preventDefault();
    let query = SubscribesStruct.subscribing;
    query.subscriber = currentUser.id;
    query.subscribed_to = user.id;

    SubscribersRequests.subscribe(query, function (success, response) {
      if (success === true) {
        setSubscribe(true);
      } else {
        console.error('Произошла ошибка при подписке', response);
      }
    });
  };

  useEffect(() => {
    let query = UsersStruct.get;
    query.userId = userId;
    query.userSlug = userSlug;

    UserRequests.get(query, function (success, response) {
      if (success === true) {
        setUser(response.data);
        SubscribersRequests.getUserSubscribers(query, function (success, response) {
          if (success === true) {
            let data = response.data;
            setSubscribers(data);
            setIsSubscribed(response.data.isSubscribed ? response.data.isSubscribed : false);
          }

        });
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className="whitebox profile-main">
            <div className="profile-columns">
              <div className="profile-avatar">
                <img src={Microservices.Users + '' + user.avatar} alt="avatar" />
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
                <Link className={subscribers.isSubscribed ? 'btn-red deactivate' : 'btn-red'} href="#" onClick={handleSubscribe}>
                    {subscribers.isSubscribed ? 'Отписаться' : 'Подписаться'}
                </Link>
                <div className="profile-subscribe__stats">
                  <span>{subscribers.count}</span> подписчиков
                </div>
              </div>
            </div>
            <div className="profile-controls">
              <div className="profile-filters">
                <Link href="#">Статьи</Link>
                <Link href="#">Комментарии</Link>
              </div>
              <p>На проекте с {user.date_joined}</p>
            </div>
          </div>
          <div className="profile-posts__controls">
            <Link href="#">Популярное</Link>
            <Link href="#" className="active">
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
