import React, {useState} from 'react';
import './CreatePost.css';
import {BlockNoteView, useBlockNote} from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';
import PostsStruct from "../../api/struct/Posts";
import PostRequests from "../../api/requests/Posts";
import {useNavigate} from 'react-router-dom';
import storage from "../../api/storage/Storage";

const CreatePost = () => {
    const editor = useBlockNote({
        onEditorContentChange: (editor) => setBlocks(editor.topLevelBlocks),
    });

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Other');
    const [selectedFile, setSelectedFile] = useState(null);
    const [blocks, setBlocks] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };
    let navigate = useNavigate();

    const handleSubmitOnServer = async (e) => {
        e.preventDefault();

        if (!blocks) {
            alert('Вы забыли написать статью)');
            return;
        }
        const query = PostsStruct.create(selectedFile,
            storage.getUserId(),
            title,
            JSON.stringify(blocks),
            category);

        PostRequests.create(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                // alert('Пост успешно создан!');
                navigate('/');
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

                    />
                </label>
            </div>
            <div>
                <
                    BlockNoteView editor={editor}
                                  theme={"light"}
                                  style={{
                                      height: '240px',
                                      backgroundColor: '#fff',
                                      borderRadius: '10px',
                                  }}
                />
            </div>
            <div className="create-post__submit">
                <label className="create-post__input">
                    <img src={skrepka} alt="skrepka"/>
                    <input accept=".jpg, .jpeg, .png" onChange={handleFileChange} type="file"/>
                    Изображение
                </label>
                {selectedFile && (
                    <>
                        <p
                            style={{
                                color: 'green',
                                backgroundColor: '#fff',
                                padding: '5px 10px',
                                borderRadius: '5px',
                            }}>
                            Изображение выбрано
                        </p>
                    </>
                )}

                <button className="btn-red">Опубликовать</button>
            </div>
        </form>
    );
};
export default CreatePost;
