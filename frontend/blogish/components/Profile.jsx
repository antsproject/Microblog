import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserRequests from '../api/requests/Users';
import UsersStruct from '../api/struct/Users';
import SubscribesStruct from '../api/struct/Subscribes';
import NoPage from './Nopage';
import SubscribersRequests from '../api/requests/Subscribers';
import Microservices from '../api/Microservices';
import { differenceInDays, differenceInYears, format } from "date-fns";
import { useSelector } from 'react-redux';
import Subscribing from './Subcribing';
import ProfileLenta from './ProfileLenta';

const Profile = (props) => {
    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const {userInfo} = props;
    const userId = userInfo.userId;
    const userSlug = userInfo.userSlug;
    
    const [userPage, setUserPage] = useState(null);
    const [currentUserDate, setCurrentUserDate] = useState('');
    const joinDate = new Date(currentUserDate);
    const daysSinceJoin = differenceInDays(new Date(), joinDate);
    const yearsSinceJoin = differenceInYears(new Date(), joinDate);


    useEffect(() => {
        let query = UsersStruct.get;
        query.userId = userId;
        query.userSlug = userSlug;
        UserRequests.get(query, function (success, response) {
            console.debug("UserRequests");
            if (success === true) {
                setUserPage(response.data);
                console.debug("Current User Data ", user);
                console.debug("Profile User Data ", userPage);
                console.debug("setCurrentUserDate()", response.data.date_joined);
                setCurrentUserDate(response.data.date_joined);
                query = SubscribesStruct.subscribing;
                query.subscriber = user.id;
                query.subscribed_to = userId
                SubscribersRequests.getStatusSubscribe(query, function (success, response) {
                    if (success === true) {
                        console.debug("getStatusSubscribe()");
                        setSubscribersInfo({
                            ...subscribersInfo,
                            is_subscribed: response.data.is_subscribed,
                            total_subscriptions: response.data.total_subscriptions,
                        });
                    }
                })
            }
        })
    }, []);

    return (
        <>
            {userPage ? (
                <>
                    <div className="whitebox profile-main">
                        <div className="profile-columns">
                            <div className="profile-avatar">
                                <img src={Microservices.Users.slice(0, -1) + userPage.avatar} alt="avatar" />
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
                                <Subscribing
                                    user={user} toUserId={userPage.id} token={token} post={false} />
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
                    <ProfileLenta posts={props.results}/>
                </> 
            ) : (
                <NoPage />
            )}
        </>
    );
};

export default Profile;
