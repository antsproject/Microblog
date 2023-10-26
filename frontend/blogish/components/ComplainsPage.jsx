import { useState, useEffect } from 'react';
import PostRequests from '../api/requests/Posts';
import UserRequests from '../api/requests/Users';
import PostsStruct from '../api/struct/Posts';
import UsersStruct from '../api/struct/Users';
import Link from 'next/link';
import Post from './Post'
import NoPage from './Nopage';



export default function ComplainsOnPosts({ data, complains }) {
    const [complainPost, setComplainPost] = useState(null);
    const [complain, setComplain] = useState(null);
    const [userComplain, setUserComplain] = useState(null);
    const [visiblePost, setVisiblePost] = useState(false);

    useEffect(() => {
        let query = PostsStruct.get;
        query.postId = data.post_id;
        PostRequests.get(query, (success, response) => {
            if (success) {
                setComplainPost(response.data.data.post);
            }
        }),
        setComplain(...complains.filter(comp => comp.id === data.complain_type)     );

        query = UsersStruct.get;
        query.userId = data.user_id;
        UserRequests.get(query, (success, response) => {
            if (success) {
                setUserComplain(response.data);
            }
        })

    }, [])

    const handleVisionPost = () => {
        if (visiblePost) {
            setVisiblePost(false);
        }
        else {
            setVisiblePost(true);
        }
    }

    return (
        <>
            {complainPost ? (
                <>
                    <div className="post newsblock-content">
                        <h3>
                            {userComplain && (<div className="">
                                Пользователь: <Link href={`user/${data.user_id}`}>{userComplain.username}</Link>
                            </div>
                            )}
                        </h3>
                        <h3>
                            {complain && (<div className=''>
                                Жалоба: {complain.type}
                            </div>)}
                        </h3>
                        <Link href='#' onClick={handleVisionPost}>{visiblePost ? ('Скрыть пост'): ('Показать пост')}</Link>
                        {visiblePost && (<Post key={complainPost.id} item={complainPost} />)}
                        
                    </div>
                </>) : (<NoPage />)}

        </>

    )
}