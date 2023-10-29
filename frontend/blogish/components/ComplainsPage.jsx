import { useState, useEffect } from 'react';
import PostRequests from '../api/requests/Posts';
import UserRequests from '../api/requests/Users';
import ComplainRequests from '../api/requests/Complain';
import PostsStruct from '../api/struct/Posts';
import UsersStruct from '../api/struct/Users';
import Link from 'next/link';
import Post from './Post'
import NoPage from './Nopage';
import { useSelector } from 'react-redux';
import ComplainStruct from '../api/struct/Complain';



export default function ComplainsOnPosts({ data, complains }) {
    const [complainPost, setComplainPost] = useState(null);
    const [complain, setComplain] = useState(null);
    const [userComplain, setUserComplain] = useState(null);
    const [visiblePost, setVisiblePost] = useState(false);
    const [visibleComplain, setVisibleComplain] = useState(true);

    const token = useSelector((state) => state.token.value);

    useEffect(() => {

        let query = PostsStruct.get;
        query.postId = data.post_id;
        const filteredComplains = complains.filter(complain => data.complain_types.includes(complain.id));
        PostRequests.get(query, (success, response) => {
            if (success) {
                setComplainPost(response.data.data.post);
            }
        }),
            setComplain(filteredComplains);

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
    const handleComplete = () => {
        let query = ComplainStruct.create;
        query.email = userComplain.email
        query.user_id = userComplain.id
        query.post_id = complainPost.id
        query.is_active = false;
        query.complain_types = data.complain_types;

        ComplainRequests.update(data.id, query, function (success, response) {
            if (success) {
                setVisibleComplain(false);
            }
        }, token.access)
    }
    return (
        <>
            {complainPost ? (
                <>
                    {visibleComplain ? (<div className="post newsblock-content">
                        <div className="complain-container">
                            <div className="complain-header">
                                <h3>
                                    {userComplain && (<>
                                        Пользователь: <Link href={`user/${data.user_id}`}>{userComplain.username}</Link>
                                    </>
                                    )}
                                </h3>
                                <div className="newsblock-date date-complain">{data.date_to_send}</div>
                            </div>
                            <h3>
                                {complain && (<div className=''>
                                    Жалобы: <ul>{complain.map((comp) => <li>{comp.type}</li>)}</ul>
                                </div>)}
                            </h3>
                            <div className="">
                                <Link href='#' onClick={handleVisionPost}>{visiblePost ? ('Скрыть пост') : ('Показать пост')}</Link>
                                {visiblePost && (<Post key={complainPost.id} item={complainPost} />)}
                            </div>
                            <button className="btn-green btn-cmp" type="submit" onClick={handleComplete}>
                                Решено
                            </button>
                        </div>
                    </div>) : ('')}

                </>) : ('')}

        </>

    )
}