import React, {useState} from 'react';
import Image from 'next/image';
import PostsStruct from '../api/struct/Posts';
import PostRequests from '../api/requests/Posts';
import storage from '../api/storage/Storage';
import {redirect} from 'next/navigation';
import dynamic from 'next/dynamic';

const CreatePost = () => {

    const Editor = dynamic(() =>
        import('./Editor'), {ssr: false});

    const [title, setTitle] = useState('');
    const [category_id, setCategory] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileCompleted, setSelectedFileCompleted] = useState(null);
    const [blocks] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setSelectedFileCompleted(URL.createObjectURL(file));
    };

    const handleSubmitOnServer = async (e) => {
        e.preventDefault();

        if (!blocks) {
            // toast.warning('Вы забыли написать статью)');
            return;
        }
        const query = PostsStruct.create(
            selectedFile,
            storage.getUserId(),
            title,
            JSON.stringify(blocks),
            category_id,
        );

        PostRequests.create(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                // toast.success('Пост успешно создан!');
                redirect('/');
            } else {
                // toast.error('Не удалось создать пост.');
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
                    value={category_id}
                    onChange={(e) => setCategory(e.target.value)}
                    required>
                    <option className="dropdown" value={1}> Other</option>
                    <option className="dropdown" value={2}> Science</option>
                    <option className="dropdown" value={3}> Money</option>
                    <option className="dropdown" value={4}> Life</option>
                    <option className="dropdown" value={5}> Tech</option>
                </select>
            </div>
            <div>
                <input
                    className="form-control__input"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Заголовок"
                />
            </div>
            <div className="block-note__form">
                <Editor/>
            </div>
            <div className="create-post__submit">
                <label className="create-post__input">
                    <Image src="/images/skrepka.svg" alt="skrepka" width={24} height={27}/>
                    <input accept=".jpg, .jpeg, .png" onChange={handleFileChange} type="file"/>
                    Изображение
                </label>
                {selectedFile && (
                    <Image
                        className="create-post__img"
                        src={selectedFileCompleted}
                        alt="Загружено"
                        width={55}
                        height={55}
                    />
                )}

                <button className="btn-red create-post__btn">Опубликовать</button>
            </div>
        </form>
    );
};
export default CreatePost;
