import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserInfoInComments from './UserInfoInComments';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import RemoveItemComment from './RemoveItemComment';
import CommentsStruct from '../../api/struct/Comments';
import CommentsRequest from '../../api/requests/Comments';
import { setCommentsCount } from '../../redux/slices/postSlice';

const Comments = ({ commentsActive, postIdProp, setCommentCount, setCommentsActive }) => {
    const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [replyingToIndex, setReplyingToIndex] = useState(null);
    const [replyingToUserIdentifier, setReplyingToUserIdentifier] = useState(null);
    const [repliesVisible, setRepliesVisible] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ commentIndex: null, replyIndex: null });

    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const targetRef = useRef(null);
    const dispatch = useDispatch();

    // const filteredComments = allComments.filter((comment) => comment.postId === postIdProp);
    useEffect(() => {
        dispatch(
            setCommentsCount(allComments.filter((comment) => comment.postId === postIdProp).length),
        );
    }, [setCommentsCount]);
    useEffect(() => {
        let query = CommentsStruct.get;

        CommentsRequest.get(query, function (success, response) {
            if (success === true) {
                const receivedData = response.data.results;
                const transformedData = receivedData?.map((r) => {
                    return {
                        commentId: r.id,
                        user_id: r.user_id,
                        postId: r.post_id,
                        comment: r.text_content,
                        likes: r.like_counter,
                        parent: r.parent,
                        replies: [],
                        created_at: r.created_at,
                        updated_at: r.updated_at,
                    };
                });
                const sortedComments = transformedData.sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at),
                );
                const filteredComments = sortedComments.filter(
                    (comment) => comment.postId === postIdProp,
                );
                setAllComments(filteredComments);
            } else {
                console.log(response.data, 'error');
            }
        });
    }, []);

    const handleSendMessage = () => {
        if (!user) {
            alert('Вам необходимо авторизоваться');
            return;
        }
        const lastComment = targetRef.current.lastChild;
        if (lastComment) {
            lastComment.scrollIntoView({ behavior: 'smooth' });
        }
        if (textareaValue.trim() !== '') {
            const newComment = {
                user_id: user.id ? user.id : '',
                comment: textareaValue,
                parent: replyingToIndex,
                likes: 0,
                replies: [],
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            };
            if (replyingToIndex !== null) {
                const targetComment = allComments.find(
                    (comment, index) => index === replyingToIndex,
                );

                if (targetComment) {
                    const updatedTargetComment = { ...targetComment };
                    updatedTargetComment.replies.push(newComment);
                    const updatedComments = [...allComments];
                    updatedComments[replyingToIndex] = updatedTargetComment;
                    setAllComments(updatedComments);
                }
                setReplyingToIndex(null);
            } else {
                // Если вы добавляете основной комментарий (не reply), добавьте его в массив всех комментариев
                const newArr = [...allComments, newComment];
                setAllComments(newArr);
            }
            sendCommentToServer(textareaValue);
            dispatch(setCommentsCount(getTotalCommentCount()));
            setTextareaValue('');
        }
    };

    const sendCommentToServer = (commentText) => {
        let query = CommentsStruct.create(
            postIdProp,
            user.id,
            commentText,
            replyingToIndex && replyingToIndex,
        );
        CommentsRequest.create(
            query,
            function (success, response) {
                if (success === true) {
                    // console.log('success', success);
                    // console.log('response', response.data.data);
                    const receivedData = response.data.data;
                    const transformedData = receivedData.map((r) => {
                        return {
                            commentId: r.id,
                            user_id: r.user_id,
                            postId: r.post_id, // потому что мы не получаем имя пользователя, только его id
                            comment: r.text_content,
                            likes: r.like_counter,
                            replies: [], // потому что мы не получаем это поле от сервера
                            created_at: r.created_at, // можно изменить на соответствующую дату на сервере, если она доступна
                        };
                    });
                    const sortedComments = transformedData.sort(
                        (a, b) => new Date(a.created_at) - new Date(b.created_at),
                    );
                    const filteredComments = sortedComments.filter(
                        (comment) => comment.postId === postIdProp,
                    );
                    setAllComments(filteredComments);
                } else {
                    console.error(response);
                }
            },
            token.access,
        );
    };

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
        dispatch(
            setCommentsCount(allComments.filter((comment) => comment.postId === postIdProp).length),
        );
        return totalCommentCount;
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
        setDeleteTarget({ commentIndex: null, replyIndex: null });
        setShowDeleteConfirmation(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="post-comments__global">
            <h2 onClick={() => setCommentsActive(!commentsActive)} className="post-comments__title">
                Комментарии ({allComments.filter((comment) => comment.postId === postIdProp).length}
                )
            </h2>
            <div ref={targetRef} className={`post-comments ${commentsActive ? '' : 'visible'}`}>
                {allComments.map((item, index) => (
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
                onClick={() => setActiveTextarea(true)}
                className={`textarea ${activeTextarea ? '' : 'deactive'}`}
            >
                <div className="textarea-fixed">
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
            </div>
            {showDeleteConfirmation && (
                <DeleteConfirmationModal onDelete={confirmDelete} onCancel={cancelDelete} />
            )}
        </div>
    );
};

export default Comments;
