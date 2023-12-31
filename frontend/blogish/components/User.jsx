import {useState, useEffect} from 'react';
import Link from 'next/link';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import SubscribesStruct from '../api/struct/Subscribes';
import NoPage from './Nopage';
import SubscribersRequests from '../api/requests/Subscribers';
import Microservices from '../api/Microservices';
import {differenceInDays, differenceInYears, format} from "date-fns";
import useUser from '../session/useUser';

const User = ({userInfo}) => {
    const userId = userInfo ? userInfo.split('-', 1) : "0";
    const userSlug = userInfo ? userInfo.split('-').slice(1).join('-') : "";

    const [subscribersInfo, setSubscribersInfo] = useState({
        is_subscribed: false,
        total_subscriptions: 0,
    });
    const {user} = useUser({});
    const [userPage, setUserPage] = useState(null);
    // const [currentUserID, setCurrentUserID] = useState(0);
    const [currentUserDate, setCurrentUserDate] = useState('');
    const joinDate = new Date(currentUserDate);
    const daysSinceJoin = differenceInDays(new Date(), joinDate);
    const yearsSinceJoin = differenceInYears(new Date(), joinDate);
    // check subscribe status on future
    // toggleSubscribed() { setIsSubscribed(false) ? IsSubscribed  :  setIsSubscribed(true);  }


    const handleSubscribe = (e) => {
        e.preventDefault();
        let query = SubscribesStruct.subscribing;
        query.subscriber = user.id;
        query.subscribed_to = userPage.id;
        // user.id;
        SubscribersRequests.subscribe(query, function (success, response) {
            if (success === true) {
                setSubscribersInfo({
                    ...subscribersInfo,
                    is_subscribed: true,
                    total_subscriptions: subscribersInfo.total_subscriptions + 1
                });
            }
        });
    };

    useEffect(() => {
        // const savedUserID = localStorage.getItem('userId');
        // if (savedUserID) {
        //     setCurrentUserID(parseInt(savedUserID));
        // }
        let query = UsersStruct.get;
        query.userId = userId;
        query.userSlug = userSlug;
        UserRequests.get(query, function (success, response) {
            if (success === true) {
                setUserPage(response.data);

                console.debug("Current User Data ", user);
                console.debug("Profile User Data ", userPage);

                console.debug("setCurrentUserDate()", response.data.date_joined);
                setCurrentUserDate(response.data.date_joined);

                query = SubscribesStruct.subscribing;
                query.subscriber = user.id;
                query.subscribed_to = userPage.id;

                SubscribersRequests.getStatusSubscribe(query, function (success, response) {
                    if (success === true) {
                        console.debug("getStatusSubscribe()");
                        setSubscribersInfo({
                            ...subscribersInfo,
                            is_subscribed: response.data.is_subscribed,
                            total_subscriptions: response.data.total_subscriptions,
                        });
                    }
                });
            }
        });


    }, []);
    return (
        <>
            {userPage ? (
                <>
                    <div className="whitebox profile-main">
                        <div className="profile-columns">
                            <div className="profile-avatar">
                                <img src={Microservices.Users + '' + userPage.avatar} alt="avatar"/>
                                <p className="profile-rating">+890973</p>
                                <p>Рейтинг</p>
                            </div>
                            <div className="profile-info">
                                <h1>{userPage.username}</h1>
                                {/* <p>userId: { userId }, userSlug: { userSlug }</p> */}
                                <p className="profile-group">Редактор</p>
                                <p className="profile-status">{userPage.status}</p>
                            </div>
                            <div className="profile-subscribe">
                                {/* deactivate */}
                                {userPage.id !== (user ? user.id : 0) && (
                                    <Link className={subscribersInfo.is_subscribed ? 'btn-red deactivate' : 'btn-red'}
                                          href="#" onClick={handleSubscribe}>
                                        {subscribersInfo.is_subscribed ? 'Отписаться' : 'Подписаться'}
                                    </Link>
                                )}
                                <div className="profile-subscribe__stats">
                                    <span>{subscribersInfo.total_subscriptions}</span> подписчиков
                                </div>
                            </div>
                        </div>
                        <div className="profile-controls">
                            <div>
                                <Link href="#">Статьи</Link>
                                <Link href="#">Комментарии</Link>
                            </div>
                            <p>
                                На проекте
                                с {format(joinDate, 'dd.MM.yyyy')} - {yearsSinceJoin} years {daysSinceJoin} days
                            </p>
                        </div>
                    </div>
                </>
            ) : (
                <NoPage/>
            )}
        </>
    );
};

export default User;
