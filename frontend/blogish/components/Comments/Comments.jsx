import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UserInfoInComments from './UserInfoInComments';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import RemoveItemComment from './RemoveItemComment';
import CommentsStruct from '../../api/struct/Comments';
import CommentsRequest from '../../api/requests/Comments';
import { setCommentsCount } from '../../redux/slices/postSlice';
import Microservices from '../../api/Microservices';
import Endpoints from '../../api/Endpoints';

const Comments = ({ commentsActive, postIdProp, setCommentsActive }) => {
    // const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [replyingToIndex, setReplyingToIndex] = useState(null);
    const [replyingToUserIdentifier, setReplyingToUserIdentifier] = useState(null);
    const [repliesVisible, setRepliesVisible] = useState({});
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ commentIndex: null, replyIndex: null });

    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const commentCount = useSelector((state) => state.post.commentsCount);
    const targetRef = useRef(null);
    const dispatch = useDispatch();
    // dispatch(setCommentsCount(allComments.length));

    // const filteredComments = allComments.filter((comment) => comment.postId === postIdProp);

    useEffect(() => {
        let query = CommentsStruct.get;

        CommentsRequest.get(postIdProp, query, function (success, response) {
            if (success === true) {
                const receivedData = response.data.results;
                console.log('receivedData', receivedData);

                const transformedData = receivedData?.map((r) => {
                    return {
                        commentId: r.id,
                        likes: r.like_counter,
                        userIdComment: r.user_id,
                        postId: r.post_id,
                        commentText: r.text_content,
                        childrenCounter: r.children_counter,
                        created_at: r.created_at,
                        updated_at: r.updated_at,
                        parent: r.parent,
                    };
                });

                setAllComments(transformedData);

                // const sortedComments = transformedData.sort(
                //     (a, b) => new Date(a.created_at) - new Date(b.created_at),
                // );
                // const filteredComments = sortedComments.filter(
                //     (comment) => comment.postId === postIdProp,
                // );
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
                userIdComment: user.id ? user.id : '',
                commentText: textareaValue,
                parent: replyingToIndex,
                // likes: likes,
                postId: postIdProp,
                // childrenCounter: childrenCounter,
                created_at: new Date().toLocaleString(),
                updated_at: new Date().toLocaleString(),
            };
            if (replyingToIndex !== null) {
                const targetComment = allComments.find(
                    (commentText, index) => index === replyingToIndex,
                );

                if (targetComment) {
                    const updatedTargetComment = { ...targetComment };
                    const newReply = {
                        userIdComment: user.id ? user.id : '',
                        commentText: textareaValue,
                        parent: replyingToIndex,
                        likes: likes,
                        postId: postId,
                        childrenCounter: childrenCounter,
                        created_at: new Date().toLocaleString(),
                        updated_at: new Date().toLocaleString(),
                    };

                    updatedTargetComment.replies.push(newReply);

                    const updatedComments = [...allComments];
                    updatedComments[replyingToIndex] = updatedTargetComment;
                    setAllComments(updatedComments);
                    setReplyingToIndex(null);
                }
            } else {
                // Если вы добавляете основной комментарий (не reply), добавьте его в массив всех комментариев
                const newArr = [...allComments, newComment];
                setAllComments(newArr);
            }
            sendCommentToServer(textareaValue);
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
                            likes: r.like_counter,
                            userIdComment: r.user_id,
                            postId: r.post_id,
                            commentText: r.text_content,
                            childrenCounter: r.children_counter,
                            created_at: r.created_at,
                            updated_at: r.updated_at,
                            parent: r.parent,
                        };
                    });
                    // const sortedComments = transformedData.sort(
                    //     (a, b) => new Date(a.created_at) - new Date(b.created_at),
                    // );
                    // const filteredComments = sortedComments.filter(
                    //     (commentText) => commentText.postId === postIdProp,
                    // );
                    setAllComments(transformedData);
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

    const handleLikeClick = (commentIndex) => {
        const comment = allComments[commentIndex];

        if (comment.didUserLike) {
            // Убрать лайк
            sendLikeRequest(comment.commentId, false, commentIndex);
        } else {
            // Поставить лайк
            sendLikeRequest(comment.commentId, true, commentIndex);
        }
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
                Комментарии ({commentCount})
            </h2>
            <div ref={targetRef} className={`post-comments ${commentsActive ? '' : 'visible'}`}>
                {allComments?.map((item, index) => (
                    <div className="comment-item" key={index}>
                        <UserInfoInComments username={item.userIdComment} />

                        <p className="comment-item__text">{item.commentText}</p>
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
                                    onClick={() => handleReply(index, item.userIdComment)}
                                    className="comment-item__btn"
                                >
                                    Ответить
                                </button>
                                {/* {item.replies.length > 0 && (
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
                                )} */}
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
                            {/* {item.replies.map((reply, replyIndex) => (
                                <div className="reply-comment" key={replyIndex}>
                                    <UserInfoInComments username={reply.userIdComment} />

                                    <p className="comment-item__text">{reply.commentText}</p>
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
                            ))} */}
                        </div>
                    </div>
                ))}
            </div>
            <div
                // onClick={() => setActiveTextarea(true)}
                className="textarea"
                // className={`textarea ${activeTextarea ? '' : 'deactive'}`}
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
