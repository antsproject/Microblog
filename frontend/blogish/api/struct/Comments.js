// const PostsStruct = {
//     get: {},
//     create(image, user_id, title, content, category_id) {
//         const formdata = new FormData();
//         if (image != null) {
//             formdata.append('image', image);
//         }
//         formdata.append('user_id', user_id);
//         formdata.append('category_id', category_id);
//         formdata.append('title', title);
//         formdata.append('content', content);

//         return formdata;
//     },
// };
// export default PostsStruct;
const CommentsStruct = {
    get: {},
    create(post_id, user_id, text_content) {
        const formdata = new FormData();
        formdata.append('post_id', post_id);
        formdata.append('user_id', user_id);
        formdata.append('text_content', text_content);

        return formdata;
    },
    createReply(post_id, user_id, text_content, parent) {
        const formdata = new FormData();
        formdata.append('post_id', post_id);
        formdata.append('user_id', user_id);
        formdata.append('text_content', text_content);
        formdata.append('parent', parent);

        return formdata;
    },
};
export default CommentsStruct;
// "id": 2,
//             "like_counter": 0,
//             "post_id": 1,
//             "user_id": 2,
//             "text_content": "Согласен",
//             "created_at": "2023-10-08T15:51:13.862063Z",
//             "updated_at": "2023-10-08T15:51:13.862095Z",
//             "parent": 1
