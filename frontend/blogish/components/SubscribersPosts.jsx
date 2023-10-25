import Post from './Post';
import { useEffect, useState } from "react";
import SubscribersRequests from '../api/requests/Subscribers';
import SubscribesStruct from '../api/struct/Subscribes';
import { useSelector } from 'react-redux';
import Microservices from '../api/Microservices';
import Image from 'next/image';
import Link from 'next/link';
import PostRequests from '../api/requests/Posts';
import PostsStruct from '../api/struct/Posts';
import NoPage from './Nopage';

const SubscriptionsPostsLenta = () => {

    const user = useSelector((state) => state.user.value);
    const [subscriptionsUsers, setSubscriptionsUsers] = useState(null);
    const [postsSub, setPostsSub] = useState(null);


    useEffect(() => {
        let query = SubscribesStruct.subscribtions;
        if (user !== null) {
            query.user_id = user.id;
        }

        SubscribersRequests.subscriptionsList(query, function (success, response) {
            console.debug("UserRequests");
            if (success === true) {
                setSubscriptionsUsers(response.data.results);
                console.log(response.data.results);

                const ids = response.data.results.map(subscriber => subscriber.id);
                // query = PostsStruct.getBySubscribers;
                // query.user_ids = ids;

                PostRequests.getPostBySubscriptions(ids, function (success, response) {
                    if (success === true) {
                        setPostsSub(response.data.results);
                    }
                })

            }
        });

    }, []);

    const handleSub = (user_id) => {
        let query = PostsStruct.getById;
        query.user_id = user_id;

        PostRequests.getById(query, function (success, response) {
            if (success) {
                setPostsSub(response.data.results);
            }
        })
    };


    return (
        <>
            {subscriptionsUsers && postsSub ? (
                <>
                    {subscriptionsUsers && subscriptionsUsers != [] && subscriptionsUsers != null && subscriptionsUsers.length > 0 ? (
                        <div className="no-page-message-box">
                            <Link href='#' className='subscription-item'>
                                {subscriptionsUsers.map((user) => (
                                    <div onClick={() => handleSub(user.id)}>
                                        <Image className="avatar-style"
                                            src={Microservices.Users.slice(0, -1) + user.avatar} width={70} height={70} alt="avatar author" />
                                        <p className='username-subscribes'>
                                            {user.username}
                                        </p>
                                    </div>
                                ))}
                            </Link>
                        </div>
                    ) : <></>}

                    {postsSub.map((post) => (<Post key={post.id} item={post} />))}
                </>) : <NoPage />}

        </>
    )
}

export default SubscriptionsPostsLenta;