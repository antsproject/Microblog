import axios from "axios";
import Endpoints from '../Endpoints'
import Microservices from "../Microservices";
import PostsStruct from "../struct/Posts";

const PostRequests = {
    get(data, callback) {
        let query = PostsStruct.get;
        query = {...data};
        const axios_config = {
            url: `${Microservices.Posts}/${Endpoints.Posts.Get}`,
            data: query,
            method: 'GET',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },

    create(data, callback) {
        const axios_config = {
            url: Microservices.Posts + '' + Endpoints.Posts.Create,
            data: data,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios_config.headers = {"Content-Type": "multipart/form-data"}

        // const access_token = Storage.getToken();
        // if (access_token) {
        //     axios_config.headers = {
        //         ...axios_config.headers,
        //         'Authorization': 'Bearer ' + access_token
        //     };
        // }

        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    }
}
export default PostRequests;
