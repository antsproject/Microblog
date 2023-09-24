import React, {useState} from 'react';
import './CreatePost.css';
import {BlockNoteView, useBlockNote} from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';
import axios from 'axios';
import UsersStruct from "../../api/struct/Users";
import PostsStruct from "../../api/struct/Posts";
import PostRequests from "../../api/requests/Posts";
import {setToken} from "../../features/tokenSlice";

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
        setSelectedFile(file);
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
        const query = PostsStruct.create(selectedFile,
            1,
            'title',
            JSON.stringify(blocks),
            'Other');

        // query.image = selectedFile;
        // query.tag.tag_name = 'Other';
        // query.title = 'title';
        // query.content = JSON.stringify(blocks);
        // query.user_id = 1;

        PostRequests.create(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                alert('Пост успешно создан!');
            } else {
                console.error(response);
            }
        });
    }
    return (
        <form onSubmit={handleSubmitOnServer} className="create-post whitebox">
            <BlockNoteView editor={editor}/>
            {/* эта строка выводит структуру объекта Blocks */}
            {/* <pre> {JSON.stringify(blocks, null, 2)}</pre> */}
            <div className="create-post__submit">
                <label className="create-post__input">
                    <img src={skrepka} alt="skrepka"/>
                    <input accept=".jpg, .jpeg, .png" onChange={handleFileChange} type="file"/>
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
