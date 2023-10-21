import axios from 'axios';
import Endpoints from '../Endpoints';
import Microservices from '../Microservices';
import CommentsStruct from '../struct/Comments';

const CommentsRequest = {
    get(id, data, callback) {
        let query = CommentsStruct.get;
        query = { ...data };
        const axios_config = {
            url: Microservices.Comments + Endpoints.Comments.Get + id + '/',
            data: query,
            method: 'GET',
            timeout: Microservices.GlobalTimeout,
        };
        axios
            .request(axios_config)
            .then((response) => {
                callback(true, response);
            })
            .catch(function (error) {
                callback(false, error);
            });
    },
    create(data, callback, access_token) {
        const axios_config = {
            url: Microservices.Comments + Endpoints.Comments.Create,
            data: data,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios_config.headers = { 'Content-Type': 'multipart/form-data' };
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                Authorization: 'Bearer ' + access_token,
            };
        }
        axios
            .request(axios_config)
            .then((response) => {
                callback(true, response);
            })
            .catch(function (error) {
                callback(false, error);
            });
    },
};
export default CommentsRequest;
