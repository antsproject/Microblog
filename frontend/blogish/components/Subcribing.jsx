'use client'

import Link from "next/link";
import { useState, useEffect } from 'react';
import SubscribesStruct from '../api/struct/Subscribes';
import SubscribersRequests from '../api/requests/Subscribers';
import { useSelector } from 'react-redux';


export default function Subscribing({styles, toUserId, post}) {
    
    const [subscriberStatus, setSubscriberStatus] = useState({
        is_subscribed: false,
        total_subscriptions: 0
    });

    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);

    const handleSubscribe = (e) => {
        e.preventDefault();
        let query = SubscribesStruct.subscribing;
        if (user !== null) {
            query.subscriber = user.id;
            query.subscribed_to = toUserId;
        }

        
        SubscribersRequests.subscribe(query, function (success, response) {
            if (success === true) {
                if (subscriberStatus.is_subscribed === false) {
                    setSubscriberStatus({
                    ...subscriberStatus,
                    is_subscribed: true,
                    total_subscriptions: subscriberStatus.total_subscriptions + 1

                });
                }
                else {
                    setSubscriberStatus({
                        ...subscriberStatus,
                        is_subscribed: false,
                        total_subscriptions: subscriberStatus.total_subscriptions - 1

                    });
                }
            }
        }, token.access);
        
    };

    useEffect (() => {
        let query = SubscribesStruct.subscribing;
        if (user !== null) {
            query.subscriber = user.id;
            query.subscribed_to = toUserId;
        }
        SubscribersRequests.getStatusSubscribe(query, function (success, response) {
            if (success === true) {
                setSubscriberStatus({
                    ...subscriberStatus,
                    is_subscribed: response.data.is_subscribed,
                    total_subscriptions: response.data.total_subscriptions,
                });
            }
        })
    }, [])

    return (
        <>
        <Link 
            href="#" 
            className={styles} 
            onClick={handleSubscribe}>
                {subscriberStatus.is_subscribed ?  
                post ? 'Вы подписаны' : 'Отписаться' : 'Подписаться'}
        </Link>
        {post ? '' : (
        <div className="profile-subscribe__stats">
            <span>{subscriberStatus.total_subscriptions}</span> подписчиков
        </div>)}
        </>
    )
}
