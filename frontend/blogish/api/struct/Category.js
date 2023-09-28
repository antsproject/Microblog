const CategoryStruct = {
    get: {},
    create(name, image) {
        const formdata = new FormData();
        if (image != null) {
            formdata.append('image', image);
        }
        formdata.append('name', name);


        return formdata;
    }
}
export default CategoryStruct;
