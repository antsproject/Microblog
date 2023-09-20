import axios from "axios";
import Endpoints from '../Endpoints'
import Microservices from "../Microservices";
import PostsStruct from "../struct/Posts";
import Storage from "../storage/Storage";

const PostRequests = {
    get(data, callback) {
        let query = PostsStruct.get;
        query = { ...data };
        const axios_config = {
            url: Microservices.Posts + '' + Endpoints.Posts.Get,
            data: query,
            method: 'GET',
            timeout: Microservices.GlobalTimeout,
        };
        const access_token = Storage.getToken();
        if(access_token) {
            axios_config.headers = {
                'Authorization': 'Bearer ' + access_token
            };
        }
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    }
}
export default PostRequests;
