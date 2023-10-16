'use client'

import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import PostsStruct from '../api/struct/Posts';
import PostRequests from '../api/requests/Posts';
import {router} from "next/client";
import {useSelector} from 'react-redux';
import EditorJS from '@editorjs/editorjs';

export default function PostEdit({postId}) {
    const user = useSelector((state) => state.user.value);
    const token = useSelector((state) => state.token.value);
    const [title, setTitle] = useState(null);
    const [category_id, setCategory] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileCompleted, setSelectedFileCompleted] = useState(null);
    const [content, setContent] = useState(null);
    const [postImage, setPostImage] = useState(null);

    useEffect(() => {
        PostRequests.get({postId}, (success, response) => {
            if (success) {
                const data = response.data.data.post;
                setTitle(data.title);
                setCategory(data.category_id);
                setPostImage(data.image);
                setContent(data.content);
                initializeEditor(data.content);
            } else {
                router.push('/');
                console.error('Error fetching post data:', response);
            }
        });
    }, [postId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setSelectedFileCompleted(URL.createObjectURL(file));
    };

    const editorRef = useRef(null);


    const initializeEditor = (editorContent) => {
        if (editorRef.current) {
            const editor = new EditorJS({
                holder: editorRef.current,
                data: editorContent,
                onChange: (api, outputData) => {
                    editor.save().then((outputData) => {
                        setContent(outputData);
                        console.log('Article data: ', outputData);
                    }).catch((error) => {
                        console.log('Saving failed: ', error);
                    });
                }
            });
        }
    };

    async function onSubmit(event) {

        event.preventDefault()


        if (!content) {
            console.error('MISS CONTENT FROM EDITOR! [ERROR]')
            return;
        }

        const query = PostsStruct.put(
            selectedFile,
            user.id,
            title,
            JSON.stringify(content),
            category_id,
        );

        PostRequests.put(postId, query, function (success, response) {
            console.debug(success, response);
            if (success === true) {
                router.push('/');
            } else {
                console.error(response);
            }
        }, token.access);
    }

    function handleTitleChange(event) {
        event.preventDefault();
        setTitle(event.target.value);
    }

    return (
        <form onSubmit={onSubmit} className="create-post whitebox">
            <div className="form-select ">
                <select
                    className="form-control__select "
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
                    className="form-control__input "
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                />
            </div>
            <div className="form-control__input " ref={editorRef}/>
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

                <button className="btn-red create-post__btn">Изменить</button>
            </div>
        </form>
    );
}
