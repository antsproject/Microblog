import React, { useState } from 'react';
import './CreatePost.css';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';
import PostsStruct from '../../api/struct/Posts';
import PostRequests from '../../api/requests/Posts';
import { useNavigate } from 'react-router-dom';
import storage from '../../api/storage/Storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import otherIMG from './images/other.svg';

const CreatePost = () => {
  const editor = useBlockNote({
    onEditorContentChange: (editor) => setBlocks(editor.topLevelBlocks),
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Other');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileCompleted, setSelectedFileCompleted] = useState(null);
  const [blocks, setBlocks] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileCompleted(URL.createObjectURL(file));
  };
  let navigate = useNavigate();

  const handleSubmitOnServer = async (e) => {
    e.preventDefault();

    if (!blocks) {
      toast.warning('Вы забыли написать статью)');
      return;
    }
    const query = PostsStruct.create(
      selectedFile,
      storage.getUserId(),
      title,
      JSON.stringify(blocks),
      category,
    );

    PostRequests.create(query, function (success, response) {
      console.debug(success, response);
      if (success === true) {
        toast.success('Пост успешно создан!');
        navigate('/');
      } else {
        toast.error('Не удалось создать пост.');
        console.error(response);
      }
    });
  };
  return (
    <form onSubmit={handleSubmitOnServer} className="create-post whitebox">
      <div className="form-select">
        <select
          className="form-control__select"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option className="form-select__option" value="Other">
            Other
          </option>
          <option className="form-select__option" value="Science">
            Science
          </option>
          <option className="form-select__option" value="Money">
            Money
          </option>
          <option className="form-select__option" value="Life">
            Life
          </option>
          <option className="form-select__option" value="Tech">
            Tech
          </option>
        </select>
      </div>
      <div className="form-floating">
        <input
          className="form-control__input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Тема"
        />
      </div>
      <div className="block-note__form">
        <BlockNoteView
          editor={editor}
          theme={'light'}
          style={{
            height: '240px',
            backgroundColor: '#fff',
            borderRadius: '10px',
          }}
        />
      </div>
      <div className="create-post__submit">
        <label className="create-post__input">
          <img src={skrepka} alt="skrepka" />
          <input accept=".jpg, .jpeg, .png" onChange={handleFileChange} type="file" />
          Изображение
        </label>
        {selectedFile && (
          <img className="create-post__img" src={selectedFileCompleted} alt="Загружено" />
        )}

        <button className="btn-red create-post__btn">Опубликовать</button>
      </div>
      <ToastContainer />
    </form>
  );
};
export default CreatePost;
