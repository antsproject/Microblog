import React from 'react';

const RemoveItemComment = ({ handlePotentialDelete, index, replyIndex }) => {
    return (
        <div className="comment-item__delete">
            <button
                className="comment-item__delete--btn"
                onClick={() => handlePotentialDelete(index, replyIndex)}
            >
                Удалить
            </button>
        </div>
    );
};

export default RemoveItemComment;
