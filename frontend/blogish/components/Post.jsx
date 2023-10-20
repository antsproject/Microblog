import Image from 'next/image';
import Subscribing from './Subcribing';
import React, {useState, useEffect} from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import Link from 'next/link';
import Microservices from '../api/Microservices';
import PostRequests from "../api/requests/Posts";
import PostRenderer from './PostRenderer';
import PostRendererEditor from "./PostRendererEditor";
import {useRouter} from "next/router";
import {useSelector} from 'react-redux';
// import UserRequests from '../api/requests/Users';
// import UsersStruct from '../api/struct/Users';
// import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
// import {setUsername} from '../redux/slices/postSlice';

export default function Post({item, category, isLiked}) {
    const currentUser = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const commentsCount = useSelector((state) => state.post.commentsCount);
    const [isDeleteClicked, setIsDeleteClicked] = useState(false);
    const [buttonText, setButtonText] = useState('Удалить');
    const pathCategory = category ? category.toLowerCase() : category;
    const router = useRouter();
    const isContentEditable = item.content && item.content.time !== undefined;
    const [liked, setLiked] = useState(isLiked);
    const likes = item.like_count
    const [likesCount, setLikesCount] = useState(likes);
    // const [username, setUsername] = useState('')
    //const username = useSelector((state) => state.post.username);
    // const dispatch = useDispatch();
    // const [isLoading, setIsLoading] = useState(true);

    const checkLikes = () => {
        console.log(isLiked)
    }
    // useEffect(() => {
    //     PostRequests.likeCount(item.id, (success, response) => {
    //         if (success) {
    //             const likeCount = response.data.count;
    //             setLikesCount(likeCount);
    //             if (response.data.results.some(result => result.user_id === currentUser.id)) {
    //                 setLiked(true);
    //             } else {
    //                 setLiked(false);
    //             }
    //         } else {
    //             console.error('Error fetching like count:', response);
    //         }
    //     });
    //
    //     let query = UsersStruct.get;
    //     query.userId = item.user_id;
    //     UserRequests.get(query, function (success, response) {
    //         setIsLoading(false);
    //         if (success === true) {
    //             // dispatch(setUsername(response.data.username));
    //             setUsername(response.data.username)
    //         }
    //     });
    // }, []);

    const handleLikeClick = () => {
        if (currentUser) {
            toggleLike(item.id);
        } else {
            console.error('You UNAUTHORIZED for likes! <<<')
        }
    };

    const toggleLike = (postId) => {
        if (liked) {
            PostRequests.likeToggle(currentUser.id, postId, (success, response) => {
                if (success) {
                    console.log(response.data.message)
                    setLiked(false);
                    setLikesCount(likesCount - 1);
                } else {
                    console.error('Error unliking post:', response);
                }
            });
        } else {
            PostRequests.likeToggle(currentUser.id, postId, (success, response) => {
                if (success) {
                    console.log(response.data.message)
                    setLiked(true);
                    setLikesCount(likesCount + 1);
                } else {
                    console.error('Error liking post:', response);
                }
            });
        }
    };

    const handleDelete = (item) => {
        if (isDeleteClicked) {
            return;
        }

        const confirmation = window.confirm('Are you sure you want to delete this post?');
        if (!confirmation) {
            return;
        }

        PostRequests.delete(item.id, token.access, (success, response) => {
            if (success) {
                console.log('Post deleted successfully.');
                setIsDeleteClicked(true);
                setButtonText('Пост удалён!');
            } else {
                console.error('Error deleting post:', response);
            }
        });
    };

    const handleEditClick = () => {
        if (!currentUser || item.user_id !== currentUser.id) {
            return;
        }

        if (!isDeleteClicked) {
            router.push({
                pathname: '/edit/',
                query: {
                    postId: item.id,
                },
            }).then(r => true);
        }
    };

    // return isLoading ? (
    //     <div key={item.id} className="post">
    //         <Skeleton width={735} height={500}/>
    //     </div>
    // ) : (
    return (
        <div key={item.id} className="post">
            <div className="post-header">
                <div className="newsblock-type">
                    <Image src="/images/globe-06.svg" width={24} height={24} alt="category icon"/>{' '}
                    {category}
                </div>
                <div className="newsblock-author">
                    {item.user.avatar ? (
                        <Image src={Microservices.Users.slice(0, -1) + item.user.avatar}
                               className="profile-mini__img"
                               width={24} height={24}
                               alt="avatar author"/>
                    ) : (
                        <Image src="/images/avatar.svg"
                               width={24} height={24}
                               alt="avatar author"/>
                    )}

                    {item.user.username}
                </div>
                <div className="newsblock-date">{item.created_at_fmt}</div>
                <div className="newsblock-subscription">
                    <Subscribing toUserId={item.user_id} post={true}/>
                </div>
            </div>
            <Link
                style={{textDecoration: 'none', color: 'inherit'}}
                href={`${pathCategory ? pathCategory : 'category'}/${item.id}`}
            >
                <div className="newsblock-content">
                    <h2>{item.title}</h2>
                    {isContentEditable ? (
                        <PostRendererEditor data={item.content}/>
                    ) : (
                        <PostRenderer data={item.content}/>
                    )}
                </div>
                <div>
                    {item.image ? (
                        <Image
                            src={Microservices.Posts.slice(0, -1) + item.image}
                            alt={item.title}
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{width: '100%', height: 'auto'}}
                            priority
                            unoptimized
                        />
                    ) : (
                        <div></div>
                        // <Image
                        //     src="/images/imagepost.svg"
                        //     alt="default-image"
                        //     width={735}
                        //     height={330}
                        //     priority
                        // />
                    )}
                </div>
            </Link>
            <div className="newsblock-footer">
                <div className="newsblock-footer__left">
                    <div className="newsblock-footer__cell">
                        <Image
                            src={liked ? "/images/heart-liked.svg" : "/images/heart.svg"}
                            width={24}
                            height={24}
                            alt={liked ? "heart-liked" : "heart"}
                            onClick={handleLikeClick}
                        />
                        <span>
                            {likesCount}
                        </span>
                    </div>
                    <Link
                        style={{textDecoration: 'none', color: 'inherit'}}
                        href={`${category}/${item.id}`}
                    >
                        <div
                            className="newsblock-footer__cell"
                        >
                            <Image
                                src="/images/message-circle-01.svg"
                                width={24}
                                height={24}
                                alt="circle"
                            />{' '}
                            {commentsCount}
                        </div>
                    </Link>
                </div>
                <div className="newsblock-footer__right">

                    {currentUser && item.user_id === currentUser.id ? (
                        <div className='newsblock-footer__right'>
                            {!isDeleteClicked && (
                                <button
                                    className={`inline ${isDeleteClicked ? 'btn-red deactivate' : 'btn-red edit-post__btn'}`}
                                    onClick={handleEditClick}>
                                    Редактировать
                                </button>
                            )}
                            <button
                                className={`inline ${isDeleteClicked ? 'btn-red deactivate' : 'btn-red'}`}
                                onClick={() => handleDelete(item)}>
                                {buttonText}
                            </button>
                        </div>
                    ) : (
                        <Image src="/images/annotation-alert.svg" width={24} height={24} alt="alert"/>
                    )}
                    <Image src="/images/bookmark.svg" width={24} height={24} alt="bookmark"/>
                </div>
            </div>
        </div>
    );
}
