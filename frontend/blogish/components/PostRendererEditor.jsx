import React from 'react';
// import EditorJS from '@editorjs/editorjs';

const PostRendererEditor = ({data}) => {
    const renderBlocks = (blocks) => {
        return blocks.map((block) => {
            switch (block.type) {
                case 'paragraph':
                    return <p key={block.id} dangerouslySetInnerHTML={{__html: block.data.text}}/>;
                default:
                    return null;
            }
        });
    };

    return <div>{renderBlocks(data.blocks)}</div>;
};

export default PostRendererEditor;
