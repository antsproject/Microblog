import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import Nopage from './Nopage';
import SubscribersRequests from '../api/requests/Subscribers';
import Microservices from '../api/Microservices';
import { useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { usePathname } from 'next/navigation';


const User = ({userInfo}) => {
  const [subscribers, setSubscribers] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    let query = UsersStruct.get;
    const userId = userInfo ? userInfo.split('-', 1) : "0";
    const userSlug = userInfo ? userInfo.split('-').slice(1).join('-') : "";
    query.userId = userId;
    query.userSlug = userSlug;
    console.log(userInfo)

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
                <Link className="btn-red" href="#">
                   Подписаться
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
