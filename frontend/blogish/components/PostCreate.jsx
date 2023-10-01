
'use client'

import React, {useState} from 'react';
import Image from 'next/image';
import PostsStruct from '../api/struct/Posts';
import PostRequests from '../api/requests/Posts';
import storage from '../api/storage/Storage';

import {redirect} from 'next/navigation';
// import 'react-quill/dist/quill.snow.css';
import {BlockNoteView, useBlockNote} from "@blocknote/react";
import "@blocknote/core/style.css";
import { router} from "next/client";

export default function CreatePost() {

    const editor = useBlockNote({
        onEditorContentChange: (editor) => setContent(editor.topLevelBlocks),
    });
    const [title, setTitle] = useState('');
    const [category_id, setCategory] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileCompleted, setSelectedFileCompleted] = useState(null);
    const [content, setContent] = useState(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setSelectedFileCompleted(URL.createObjectURL(file));
    };

    async function onSubmit(event) {

        event.preventDefault()


        if (!content) {
            console.error('MISS CONTENT FROM EDITOR! [ERROR]')
            return;
        }

        const query = PostsStruct.create(
            selectedFile,
            storage.getUserId(),
            title,
            JSON.stringify(content),
            category_id,
        );

        PostRequests.create(query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                router.push('/');
            } else {
                console.error(response);
            }
        });
    }

    function handleTitleChange(event) {
        event.preventDefault();
        setTitle(event.target.value);
    }

    return (
        <form onSubmit={onSubmit} className="create-post whitebox">
            <div className="form-select inline">
                <select
                    className="form-control__select inline"
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
                    className="form-control__input inline"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    placeholder="Заголовок"
                />
            </div>
            <div className="block-note__form">

                <BlockNoteView editor={editor} theme='light' />
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
}
