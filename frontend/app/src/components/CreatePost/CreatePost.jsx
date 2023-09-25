import React, {useState} from 'react';
import './CreatePost.css';
import {BlockNoteView, useBlockNote} from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';
import PostsStruct from "../../api/struct/Posts";
import PostRequests from "../../api/requests/Posts";


const CreatePost = () => {
    const editor = useBlockNote({
        // тут отслеживаем каждое изменение в редакторе
        onEditorContentChange: (editor) => setBlocks(editor.topLevelBlocks),
    });

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');

    // сюда сохраняем/записываем состояние файла(изображения)
    const [selectedFile, setSelectedFile] = useState(null);
    // сюда сохраняем/записываем состояние редактора, которое на 12 строке
    const [blocks, setBlocks] = useState(null);
    // сюда сохраняем/записываем состояние редактора и файла
    // const [allData, setAllData] = useState([]);
    // Обработчик изменения выбранного файла
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmitOnServer = async (e) => {
        e.preventDefault();

        if (!blocks) {
            alert('Вы забыли написать статью)');
            return;
        }
        const query = PostsStruct.create(selectedFile,
            1,
            title,
            JSON.stringify(blocks),
            category);

        // const query = PostsStruct.create(selectedFile,
        //     1,
        //     JSON.stringify(blocks),
        //     'Other');


        PostRequests.create(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                alert('Пост успешно создан!');
                // window.location.href = 'http://localhost:3000/post/';
            } else {
                console.error(response);
            }
        });
    }
    return (
        <form onSubmit={handleSubmitOnServer} className="create-post whitebox">
            <div className="form-select">
                <label htmlFor="category">Категория:</label>
                <div>
                    <select
                        className="form-control-inputs"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required>
                        <option value="Other">Other</option>
                        <option value="Science">Science</option>
                        <option value="Money">Money</option>
                        <option value="Life">Life</option>
                        <option value="Tech">Tech</option>
                    </select>
                </div>
            </div>
            <div className="form-floating">
                <label>
                    <input className="form-control-inputs"
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           required
                           placeholder="Тема"

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
            <p
              style={{
                color: 'green',
                backgroundColor: '#979797',
                padding: '5px 10px',
                borderRadius: '5px',
              }}
            >
              Изображение загружено
            </p>
          </>
        )}

                <button className="btn-red">Опубликовать</button>
            </div>
        </form>
    );
};
export default CreatePost;
