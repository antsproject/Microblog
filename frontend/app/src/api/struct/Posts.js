const PostsStruct = {
    get: {},
    create(image, user_id, title, content, tag_name) {
        const formdata = new FormData();
        if (image != null) {
            formdata.append('image', image);
        }
        formdata.append('user_id', user_id);
        formdata.append('tag_name', tag_name);
        formdata.append('title', title);
        formdata.append('content', content);

        return formdata;

        // "image": null,
        // "tag": {
        //     "tag_name": "",
        //     "tag_image": null
        // },
        // "user_id": null,
        // "title": "",
        // "content": ""
    }
}
export default PostsStruct;
