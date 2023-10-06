import React from 'react';

const DeleteConfirmationModal = ({ onDelete, onCancel }) => {
    const confirmDelete = () => {
        onDelete(); // Вызываем onDelete при подтверждении удаления
    };

    const cancelDelete = () => {
        onCancel(); // Вызываем onCancel при отмене удаления
    };

    return (
        <>
            <div className="auth-shadow">
                <div className="confirmation-modal">
                    <h2>Подтвердите действие</h2>
                    <p>Удалить комментарий?</p>
                    <button
                        style={{ marginRight: '15px', padding: '10px 30px' }}
                        onClick={confirmDelete}
                    >
                        Удалить
                    </button>
                    <button style={{ padding: '10px 30px' }} onClick={cancelDelete}>
                        Отмена
                    </button>
                </div>
            </div>
        </>
    );
};

export default DeleteConfirmationModal;
