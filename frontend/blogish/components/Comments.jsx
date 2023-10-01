import Image from 'next/image';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Comments = ({ commentsActive, commentCount, setCommentCount }) => {
    const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [isAnnotation, setIsAnnotation] = useState(false);

    const user = useSelector((state) => state.global.data.user);

    // Функция для автоматического изменения высоты текстового поля
    const autoExpand = (textarea) => {
        setTimeout(function () {
            textarea.style.cssText = 'height:auto; padding:0';
            textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
        }, 0);
    };

    // Обработчик изменения текстового поля
    const handleChangeTextarea = (e) => {
        setTextareaValue(e.target.value);
        autoExpand(e.target);
    };

    // Обработчик отправки комментария
    const handleSendMessage = () => {
        if (!user) {
            alert('Вам необходимо авторизоваться');
            return;
        }
        if (textareaValue.trim() !== '') {
            // Проверяем, что комментарий не пустой
            const newComment = {
                username: user ? user.username : '',
                comment: textareaValue,
                likes: likes,
                created_at: new Date().toLocaleString(), // Используем дату и время
            };
            const newArr = [...allComments, newComment];
            setAllComments(newArr);
            setCommentCount(commentCount + 1);
            setTextareaValue('');
        }
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
                            <Image src="/images/heart.svg" width={24} height={24} alt="heart" />{' '}
                            {item.likes}
                            <button className="comment-item__btn">Ответить</button>
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
