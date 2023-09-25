import React, { useState } from 'react';
import './CreatePost.css';
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
  // const [allData, setAllData] = useState([]);
  // Обработчик изменения выбранного файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(URL.createObjectURL(file));
  };
  // Обработчик отправки файла (здесь вы можете добавить логику для отправки файла на сервер)
  // const handleFileUpload = () => {
  //   if (selectedFile) {
  //     console.log('Отправка файла:', selectedFile);
  //     setAllData([...allData]);
  //   } else {
  //     alert('Выберите файл для загрузки.');
  //   }
  // };
  // Обработчик отправки редактора текста и файла
  const handleSubmitOnServer = async (e) => {
    e.preventDefault();

    if (!blocks) {
      alert('Вы забыли написать статью)');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('userId', 1);
      formData.append('title', 'asdasdasd');
      formData.append('text', JSON.stringify(blocks)); // Отправляем структуру редактора текста
      formData.append('file', selectedFile); // Отправляем файл

      const response = await axios.post('http://localhost:8082/api/posts/', formData);
      console.log(formData);
      console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmitOnServer} className="create-post whitebox">
      <BlockNoteView editor={editor} />
      {/* эта строка выводит структуру объекта Blocks */}
      {/* <pre> {JSON.stringify(blocks, null, 2)}</pre> */}
      <div className="create-post__submit">
        <label className="create-post__input">
          <img src={skrepka} alt="skrepka" />
          <input accept=".jpg, .jpeg, .png" onChange={handleFileChange} type="file" />
          Изображение
        </label>
        {selectedFile && (
          <>
            <img
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid gray',
                borderRadius: '5px',
              }}
              src={selectedFile}
            />
          </>
        )}

        <button className="btn-red">Опубликовать</button>
      </div>
    </form>
  );
};

export default CreatePost;
