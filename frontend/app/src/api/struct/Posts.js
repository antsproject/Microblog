const PostsStruct = {
    get: {},
    create(image, user_id, title, content, category) {
        const formdata = new FormData();
        if (image != null) {
            formdata.append('image', image);
        }
        formdata.append('user_id', user_id);
        formdata.append('category', category);
        formdata.append('title', title);
        formdata.append('content', content);

        return formdata;
    }
}
export default PostsStruct;
