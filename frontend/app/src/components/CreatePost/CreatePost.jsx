import React, { useState } from 'react';
import './CreatePost.css';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';

const CreatePost = () => {
  const editor = useBlockNote({});
  const [selectedFile, setSelectedFile] = useState(null);

  // Обработчик изменения выбранного файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Обработчик отправки файла (здесь вы можете добавить логику для отправки файла на сервер)
  const handleFileUpload = () => {
    if (selectedFile) {
      // Здесь может быть ваш код для отправки файла на сервер
      console.log('Отправка файла:', selectedFile);
    } else {
      alert('Выберите файл для загрузки.');
    }
  };

  return (
    <div className="create-post whitebox">
      <BlockNoteView editor={editor} />
      <div className="create-post__submit">
        <label className="create-post__input">
          <img src={skrepka} alt="skrepka" />
          <input accept=".jpg, .jpeg, .png" onChange={handleFileChange} type="file" />
          Изображение
        </label>

        <button onClick={handleFileUpload} className="btn-red">
          Опубликовать
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
