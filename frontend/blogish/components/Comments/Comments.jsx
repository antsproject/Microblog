import Image from 'next/image';
import React, { useState } from 'react';
import useUser from '../../session/useUser';
import UserInfoInComments from './UserInfoInComments';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import RemoveItemComment from './RemoveItemComment';

const Comments = ({ commentsActive, commentCount, setCommentCount }) => {
    const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [replyingToIndex, setReplyingToIndex] = useState(null);
    const [replyingToUserIdentifier, setReplyingToUserIdentifier] = useState(null);
    const [repliesVisible, setRepliesVisible] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ commentIndex: null, replyIndex: null });

    const { user } = useUser({});

    const autoExpand = (textarea) => {
        setTimeout(function () {
            textarea.style.cssText = 'height:auto; padding:21px';
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
            setCommentCount(commentCount + 1);
            setTextareaValue('');
        }
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
    const handleReply = (index, username) => {
        setReplyingToIndex(index);
        setReplyingToUserIdentifier(username);
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
        <div className={`post-comments ${commentsActive ? 'visible' : ''}`}>
            <h2 className="post-comments__title">Комментарии ({commentCount})</h2>
            {allComments.map((item, index) => (
                <div className="comment-item" key={index}>
                    <UserInfoInComments username={item.username} />

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
                                onClick={() => handleReply(index, item.username)}
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
                                src="/images/annotation-alert.svg"
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
                                <UserInfoInComments username={reply.username} />

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
                                            src="/images/annotation-alert.svg"
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
            <div
                onClick={() => setActiveTextarea(true)}
                className={`textarea ${activeTextarea ? '' : 'deactive'}`}
            >
                <textarea
                    onResize={true}
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
