import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserInfoInComments from './UserInfoInComments';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import RemoveItemComment from './RemoveItemComment';
import CommentsStruct from '../../api/struct/Comments';
import CommentsRequest from '../../api/requests/Comments';
import { setCommentsCount } from '../../redux/slices/postSlice';

const Comments = ({ commentsActive, postIdProp, setCommentCount, setCommentsActive, userId }) => {
    const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [replyingToIndex, setReplyingToIndex] = useState(null);
    const [replyingToUserIdentifier, setReplyingToUserIdentifier] = useState(null);
    const [repliesVisible, setRepliesVisible] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ commentIndex: null, replyIndex: null });
    const [commentAdded, setCommentAdded] = useState(false);

    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const targetRef = useRef(null);
    const dispatch = useDispatch();
    const filteredComments = allComments.filter((comment) => comment.postId === postIdProp);
    useEffect(() => {
        dispatch(setCommentsCount(filteredComments.length));
    }, [setCommentsCount]);

    useEffect(() => {
        let query = CommentsStruct.get;

        CommentsRequest.get(query, function (success, response) {
            if (success === true) {
                const receivedData = response.data.results;
                console.log();
                const transformedData = receivedData.map((r) => {
                    return {
                        commentId: r.id,
                        user_id: r.user_id,
                        postId: r.post_id, // потому что мы не получаем имя пользователя, только его id
                        comment: r.text_content,
                        didUserLike: false, // потому что мы не получаем это поле от сервера
                        userLikes: [], // потому что мы не получаем это поле от сервера
                        likes: r.like_counter,
                        replies: [], // потому что мы не получаем это поле от сервера
                        isAnnotation: false, // потому что мы не получаем это поле от сервера
                        created_at: r.created_at, // можно изменить на соответствующую дату на сервере, если она доступна
                    };
                });
                const sortedComments = transformedData.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at),
                );
                setAllComments(sortedComments);
            } else {
                console.log(response.data, 'error');
            }
        });
    }, [commentAdded]);
    const autoExpand = (textarea) => {
        setTimeout(function () {
            textarea.style.cssText = 'height:auto; padding:30px';
            textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
        }, 0);
    };

    const handleChangeTextarea = (e) => {
        setTextareaValue(e.target.value);
        autoExpand(e.target);
    };

    const handleTextareaResize = (event) => {
        console.log('Textarea resized:', event.target);
    };

    const getTotalCommentCount = () => {
        let totalCommentCount = allComments.length;

        allComments.forEach((comment) => {
            totalCommentCount += comment.replies.length;
        });
        dispatch(setCommentsCount(filteredComments.length));
        return totalCommentCount;
    };

    const handleSendMessage = () => {
        if (!user) {
            alert('Вам необходимо авторизоваться');
            return;
        }

        if (textareaValue.trim() !== '') {
            const newComment = {
                user_id: userId ? userId : '',
                comment: textareaValue,
                didUserLike: false,
                userLikes: [],
                likes: 0,
                replies: [],
                isAnnotation: false,
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
            sendCommentToServer(textareaValue);
            setCommentsActive(true);
            setCommentAdded(true);
            dispatch(setCommentsCount(getTotalCommentCount()));
            setTextareaValue('');
        }
    };
    const sendCommentToServer = (commentText) => {
        let query = CommentsStruct.create(postIdProp, userId, commentText);

        CommentsRequest.create(
            query,
            function (success, response) {
                if (success === true) {
                    console.log('success', success);
                    console.log('response', response);
                    setTextareaValue('');
                } else {
                    console.error(response);
                    alert('вы не авторизованы');
                }
            },
            token.access,
        );
    };
    const handleLikeClick = (commentIndex, replyIndex) => {
        setAllComments((prevState) =>
            prevState.map((comment, index) => {
                if (index !== commentIndex) {
                    return comment;
                }

                if (replyIndex !== undefined) {
                    const updatedReplies = comment.replies.map((reply, i) => {
                        if (i === replyIndex) {
                            if (reply.userLikes.includes(user.username)) {
                                return {
                                    ...reply,
                                    likes: reply.likes - 1,
                                    didUserLike: false,
                                    userLikes: reply.userLikes.filter((u) => u !== user.username),
                                };
                            } else {
                                return {
                                    ...reply,
                                    likes: reply.likes + 1,
                                    didUserLike: true,
                                    userLikes: [...reply.userLikes, user.username],
                                };
                            }
                        }
                        return reply;
                    });

                    return { ...comment, replies: updatedReplies };
                }

                if (comment.userLikes?.includes(user.username)) {
                    return {
                        ...comment,
                        likes: comment.likes - 1,
                        didUserLike: false,
                        userLikes: comment.userLikes.filter((u) => u !== user.username),
                    };
                } else {
                    return {
                        ...comment,
                        likes: comment.likes + 1,
                        didUserLike: true,
                        userLikes: [...comment.userLikes, user.username],
                    };
                }
            }),
        );
    };
    const handleReply = (index, userId) => {
        setReplyingToIndex(index);
        setReplyingToUserIdentifier(userId);
        setActiveTextarea(true);
    };

    const handleToggleReplies = (commentIndex) => {
        setRepliesVisible((prevState) => ({
            ...prevState,
            [commentIndex]: !prevState[commentIndex],
        }));
    };

    const handleAnnotationChange = (commentIndex, replyIndex) => {
        setAllComments((prevState) =>
            prevState.map((comment, i) => {
                if (commentIndex !== i) {
                    return comment;
                }

                if (replyIndex !== undefined) {
                    const updatedReplies = comment.replies.map((reply, j) => {
                        if (j === replyIndex) {
                            return { ...reply, isAnnotation: !reply.isAnnotation };
                        }
                        return reply;
                    });

                    return { ...comment, replies: updatedReplies };
                }

                return { ...comment, isAnnotation: !comment.isAnnotation };
            }),
        );
    };

    const handlePotentialDelete = (commentIndex, replyIndex) => {
        setDeleteTarget({ commentIndex, replyIndex });
        setShowDeleteConfirmation(true);
    };
    const confirmDelete = () => {
        const { commentIndex, replyIndex } = deleteTarget;

        setAllComments((prevState) =>
            prevState
                .map((comment, index) => {
                    if (index !== commentIndex) {
                        return comment;
                    }

                    if (replyIndex !== undefined) {
                        const updatedReplies = comment.replies.filter(
                            (reply, i) => i !== replyIndex,
                        );
                        return { ...comment, replies: updatedReplies };
                    }

                    return null;
                })
                .filter((comment) => comment !== null),
        );
        setCommentCount((prevCount) => prevCount - 1);
        setDeleteTarget({ commentIndex: null, replyIndex: null });
        setShowDeleteConfirmation(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="post-comments__global">
            <h2 onClick={() => setCommentsActive(!commentsActive)} className="post-comments__title">
                Комментарии ({filteredComments.length})
            </h2>
            <div className={`post-comments ${commentsActive ? 'visible' : ''}`}>
                {filteredComments.map((item, index) => (
                    <div className="comment-item" key={index}>
                        <UserInfoInComments username={item.user_id} />

                        <p className="comment-item__text">{item.comment}</p>
                        <div className="comment-item__more">
                            <div className="comment-item__likes">
                                <Image
                                    onClick={() => handleLikeClick(index)}
                                    src={
                                        item.didUserLike
                                            ? '/images/heart-liked.svg'
                                            : '/images/heart.svg'
                                    }
                                    width={24}
                                    height={24}
                                    alt="heart"
                                />
                                {item.likes}
                                <button
                                    onClick={() => handleReply(index, item.user_id)}
                                    className="comment-item__btn"
                                >
                                    Ответить
                                </button>
                                {item.replies.length > 0 && (
                                    <button
                                        onClick={() => handleToggleReplies(index)}
                                        className="comment-item__btn--reply"
                                    >
                                        {repliesVisible[index]
                                            ? 'Скрыть ответы'
                                            : item.replies.length === 1
                                            ? '1 ответ'
                                            : item.replies.length < 5
                                            ? `${item.replies.length} ответа`
                                            : `${item.replies.length} ответов`}
                                    </button>
                                )}
                            </div>

                            <div className="comment-item__annotation">
                                <Image
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleAnnotationChange(index)}
                                    src="/images/dots.svg"
                                    width={24}
                                    height={24}
                                    alt="annotation"
                                />{' '}
                                {item.isAnnotation && (
                                    <RemoveItemComment
                                        handlePotentialDelete={handlePotentialDelete}
                                        index={index}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={repliesVisible[index] ? 'replies' : 'replies hidden'}>
                            {item.replies.map((reply, replyIndex) => (
                                <div className="reply-comment" key={replyIndex}>
                                    <UserInfoInComments username={reply.user_id} />

                                    <p className="comment-item__text">{reply.comment}</p>
                                    <div className="comment-item__more">
                                        <div className="comment-item__likes">
                                            <Image
                                                onClick={() => handleLikeClick(index, replyIndex)}
                                                src={
                                                    reply.didUserLike
                                                        ? '/images/heart-liked.svg'
                                                        : '/images/heart.svg'
                                                }
                                                width={24}
                                                height={24}
                                                alt="heart"
                                            />{' '}
                                            {reply.likes}
                                            <button
                                                onClick={() => handleReply(index, item.username)}
                                                className="comment-item__btn"
                                            >
                                                Ответить
                                            </button>
                                        </div>
                                        <div className="comment-item__annotation">
                                            <Image
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    handleAnnotationChange(index, replyIndex)
                                                }
                                                src="/images/dots.svg"
                                                width={24}
                                                height={24}
                                                alt="annotation"
                                            />{' '}
                                            {reply.isAnnotation && (
                                                <RemoveItemComment
                                                    handlePotentialDelete={handlePotentialDelete}
                                                    index={index}
                                                    replyIndex={replyIndex}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div
                ref={targetRef}
                onClick={() => setActiveTextarea(true)}
                className={`textarea ${activeTextarea ? '' : 'deactive'}`}
            >
                <textarea
                    onResize={handleTextareaResize}
                    className="post-comments__textarea"
                    value={textareaValue}
                    onChange={handleChangeTextarea}
                    placeholder={` ${
                        replyingToIndex != null
                            ? `Вы отвечаете на комментарий ${replyingToUserIdentifier}`
                            : 'Написать комментарий...'
                    } `}
                />
                <button onClick={handleSendMessage} className="btn-red post-comments__btn">
                    <Image src="/images/paperplane.svg" width={24} height={24} alt="heart" />{' '}
                    Отправить
                </button>
            </div>
            {showDeleteConfirmation && (
                <DeleteConfirmationModal onDelete={confirmDelete} onCancel={cancelDelete} />
            )}
        </div>
    );
};

export default Comments;
