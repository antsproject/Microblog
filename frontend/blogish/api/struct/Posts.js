const PostsStruct = {
    get: {},
    create(image, user_id, title, content, category_id) {
        const formdata = new FormData();
        if (image != null) {
            formdata.append('image', image);
        }
        formdata.append('user_id', user_id);
        formdata.append('category_id', category_id);
        formdata.append('title', title);
        formdata.append('content', content);

        return formdata;
    },
    getById: {user_id: ''},
    getBySubscribers: {users_ids: []}
}
export default PostsStruct;
