import Image from 'next/image';
import React, { useState } from 'react';
import useUser from '../session/useUser';

const Comments = ({ commentsActive, commentCount, setCommentCount }) => {
    const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [isAnnotation, setIsAnnotation] = useState(false);
    const [replyingToIndex, setReplyingToIndex] = useState(null);

    const { user } = useUser({});

    const autoExpand = (textarea) => {
        setTimeout(function () {
            textarea.style.cssText = 'height:auto; padding:0';
            textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
        }, 0);
    };

    const handleChangeTextarea = (e) => {
        setTextareaValue(e.target.value);
        autoExpand(e.target);
    };

    const handleSendMessage = () => {
        if (!user) {
            alert('Вам необходимо авторизоваться');
            return;
        }
        if (textareaValue.trim() !== '') {
            const newComment = {
                username: user ? user.username : '',
                comment: textareaValue,
                likes: 0,
                replies: [],
                created_at: new Date().toLocaleString(),
            };
            if (replyingToIndex !== null) {
                const updatedComments = [...allComments];
                updatedComments[replyingToIndex].replies.push(newComment);
                setAllComments(updatedComments);
                setReplyingToIndex(null);
            } else {
                const newArr = [...allComments, newComment];
                setAllComments(newArr);
            }
            setCommentCount(commentCount + 1);
            setTextareaValue('');
        }
    };

    const handleLikeClick = (commentIndex, replyIndex) => {
        const updatedComments = [...allComments];

        if (replyIndex !== undefined) {
            // Если есть replyIndex, это лайк для ответа
            updatedComments[commentIndex].replies[replyIndex].likes += 1;
        } else {
            // В противном случае, это лайк для основного комментария
            updatedComments[commentIndex].likes += 1;
        }

        setAllComments(updatedComments);
    };

    const handleReply = (index) => {
        setReplyingToIndex(index);
        setActiveTextarea(true);
    };

    return (
        <div className={`post-comments ${commentsActive ? 'visible' : ''}`}>
            <h2 className="post-comments__title">Комментарии ({commentCount})</h2>
            {allComments.map((item, index) => (
                <div className="comment-item" key={index}>
                    <div className="comment-item__user">
                        <Image
                            className="profile-mini__img"
                            src="/images/miniprofile.jpg"
                            alt="profile"
                            width={45}
                            height={45}
                        />
                        <p className="comment-item__username">{item.username}</p>
                    </div>
                    <p className="comment-item__text">{item.comment}</p>
                    <div className="comment-item__more">
                        <div className="comment-item__likes">
                            <Image
                                onClick={() => handleLikeClick(index)}
                                src="/images/heart.svg"
                                width={24}
                                height={24}
                                alt="heart"
                            />{' '}
                            {item.likes}
                            <button
                                onClick={() => handleReply(index)}
                                className="comment-item__btn"
                            >
                                Ответить
                            </button>
                            {/* {item.replies.length > 0 && (
                                <button className="comment-item__btn">Лайк</button>
                            )} */}
                        </div>

                        <div className="comment-item__annotation">
                            <Image
                                onMouseEnter={() => setIsAnnotation(true)}
                                onMouseLeave={() => setIsAnnotation(false)}
                                src="/images/annotation-alert.svg"
                                width={24}
                                height={24}
                                alt="annotation"
                            />{' '}
                            {isAnnotation && (
                                <p className="comment-item__created_at">
                                    Опубликовано: {item.created_at}
                                </p>
                            )}
                        </div>
                    </div>
                    {item.replies.map((reply, replyIndex) => (
                        <div className="reply-comment" key={replyIndex}>
                            <div className="comment-item__user">
                                <Image
                                    className="profile-mini__img"
                                    src="/images/miniprofile.jpg"
                                    alt="profile"
                                    width={45}
                                    height={45}
                                />
                                <p className="comment-item__username">{reply.username}</p>
                            </div>

                            <p>{reply.comment}</p>

                            <div className="comment-item__likes">
                                <Image
                                    onClick={() => handleLikeClick(index, replyIndex)}
                                    src="/images/heart.svg"
                                    width={24}
                                    height={24}
                                    alt="heart"
                                />{' '}
                                {reply.likes}
                                <button
                                    onClick={() => handleReply(index)}
                                    className="comment-item__btn"
                                >
                                    Ответить
                                </button>
                                {/* {item.replies.length > 0 && (
                                    <button className="comment-item__btn">Лайк</button>
                                )} */}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
            <div
                onClick={() => setActiveTextarea(true)}
                className={`textarea ${activeTextarea ? '' : 'deactive'}`}
            >
                <textarea
                    onResize={true}
                    className="post-comments__textarea"
                    value={textareaValue}
                    onChange={handleChangeTextarea}
                    placeholder="Написать комментарий..."
                />
                <button onClick={handleSendMessage} className="btn-red post-comments__btn">
                    <Image src="/images/paperplane.svg" width={24} height={24} alt="heart" />{' '}
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default Comments;
// import Image from 'next/image';
// import React, { useState } from 'react';
// const Comments = ({ commentsActive, commentCount, setCommentCount }) => {
//     const [activeTextarea, setActiveTextarea] = useState(false);
//     const [textareaValue, setTextareaValue] = useState('');
//     const [comment, setComment] = useState({
//         comment: '',
//         created_at: Date.now(),
//         updated_at: Date.now(),
//     });
//     const [allComments, setAllComments] = useState([]);
//     const autoExpand = (textarea) => {
//         setTimeout(function () {
//             textarea.style.cssText = 'height:auto; padding:0';
//             textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
//         }, 0);
//     };
//     const handleChangeTextarea = (e) => {
//         setTextareaValue(e.target.value);
//         autoExpand(e.target);
//     };
//     const addToAllComment = (value) => {
//         const newArr = [...allComments, value];
//         setAllComments(newArr);
//     };
//     console.log(comment, 'comment');
//     const handleSendMessage = () => {
//         setComment(textareaValue);
//         addToAllComment(comment);
//         setCommentCount(commentCount + 1);
//         setTextareaValue('');
//     };
//     return (
//         <div className={`post-comments ${commentsActive ? 'visible' : ''}`}>
//             <h2 className="post-comments__title">Комментарии ({commentCount})</h2>
//             <div
//                 onClick={() => setActiveTextarea(true)}
//                 className={`textarea ${activeTextarea ? '' : 'deactive'} `}
//             >
//                 <textarea
//                     onResize={true}
//                     className="post-comments__textarea"
//                     value={textareaValue}
//                     onChange={handleChangeTextarea}
//                     placeholder="Написать комментарий..."
//                 />
//                 <button onClick={handleSendMessage} className="btn-red post-comments__btn">
//                     <Image src="/images/paperplane.svg" width={24} height={24} alt="paper" />
//                     Отправить
//                 </button>
//                 {''}
//             </div>
//             {allComments.map((item) => (
//                 <div key={item.comment}>
//                     <p>{item.comment}</p>
//                     <p>{item.created_at}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default Comments;
