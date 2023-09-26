import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CreatePost.css';
import { BlockNoteView, useBlockNote } from '@blocknote/react';
import '@blocknote/core/style.css';
import skrepka from '../../images/skrepka.svg';
import PostsStruct from '../../api/struct/Posts';
import PostRequests from '../../api/requests/Posts';

const CreatePost = () => {
  const editor = useBlockNote({
    onEditorContentChange: (editor) => setBlocks(editor.topLevelBlocks),
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileCompleted, setSelectedFileCompleted] = useState(null);
  const [blocks, setBlocks] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setSelectedFileCompleted(URL.createObjectURL(file));
  };

  const handleSubmitOnServer = async (e) => {
    e.preventDefault();

    if (!blocks) {
      toast.warning('Вы забыли написать статью)');
      return;
    }
    const query = PostsStruct.create(selectedFile, 1, title, JSON.stringify(blocks), category);

    // const query = PostsStruct.create(selectedFile,
    //     1,
    //     JSON.stringify(blocks),
    //     'Other');

    PostRequests.create(query, function (success, response) {
      console.debug(success, response);
      if (success === true) {
        toast.success('Пост успешно создан!');
        // window.location.href = 'http://localhost:3000/post/';
      } else {
        toast.error('Не удалось создать пост.');
        console.error(response);
      }
    });
  };
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
            required
          >
            {/* {category.map((item) => (
              <option key={item.id} value={item}>
                {item}
              </option>
            ))} */}
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
          <input
            className="form-control-inputs"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Тема"
          />
        </label>
      </div>
      <div>
        <BlockNoteView
          editor={editor}
          theme={'dark'}
          style={{
            height: '240px',
            backgroundColor: '#1F1F1F',
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
          <img className="create-post__img" src={selectedFileCompleted} alt="completed" />
        )}

        <button className="btn-red">Опубликовать</button>
      </div>
      <ToastContainer />
    </form>
  );
};
export default CreatePost;
