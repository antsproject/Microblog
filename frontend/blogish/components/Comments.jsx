import Image from 'next/image';
import React, { useState } from 'react';
const Comments = ({ commentsActive }) => {
    const [activeTextarea, setActiveTextarea] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const handleChangeTextarea = (e) => {
        setTextareaValue(e.target.value);
    };
    return (
        <div className={`post-comments ${commentsActive ? 'visible' : ''}`}>
            <h2 className="post-comments__title">Комментарии ({0 || null})</h2>
            <div
                onClick={() => setActiveTextarea(true)}
                className={`textarea ${activeTextarea ? '' : 'deactive'} `}
            >
                <textarea
                    onResize={true}
                    className="post-comments__textarea"
                    value={textareaValue}
                    onChange={handleChangeTextarea}
                    placeholder="Написать комментарий..."
                />
                <button className="btn-red post-comments__btn">
                    <Image src="/images/paperplane.svg" width={24} height={24} alt="paper" />
                    Отправить
                </button>
                {''}
            </div>
        </div>
    );
};

export default Comments;
