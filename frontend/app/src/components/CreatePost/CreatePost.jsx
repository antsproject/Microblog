import React, { useState } from 'react';
import './CreatePost.css';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';
import axios from 'axios';

const CreatePost = () => {
  const editor = useBlockNote({
    // тут отслеживаем каждое изменение в редакторе
    onEditorContentChange: (editor) => setBlocks(editor.topLevelBlocks),
  });
  // сюда сохраняем/записываем состояние файла(изображения)
  const [selectedFile, setSelectedFile] = useState(null);
  // сюда сохраняем/записываем состояние редактора, которое на 12 строке
  const [blocks, setBlocks] = useState(null);
  // сюда сохраняем/записываем состояние редактора и файла
  const [allData, setAllData] = useState([]);

  // Обработчик изменения выбранного файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Обработчик отправки файла (здесь вы можете добавить логику для отправки файла на сервер)
  const handleFileUpload = () => {
    if (selectedFile) {
      console.log('Отправка файла:', selectedFile);
      setAllData(allData.push((item) => item));
    } else {
      alert('Выберите файл для загрузки.');
    }
  };
  // Обработчик отправки редактора текста и файла
  const handleSubmitOnServer = () => {
    try {
      // тут нужно добавить запрос на сервер
      const response = axios.get('', allData);
      console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmitOnServer} className="create-post whitebox">
      <BlockNoteView editor={editor} />
      {/* эта строка выводит структуру объекта Blocks */}
      <pre> {JSON.stringify(blocks, null, 2)}</pre>
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
    </form>
  );
};

export default CreatePost;
