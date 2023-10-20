import axios from "axios";
import Endpoints from "../Endpoints";
import Microservices from "../Microservices";
import PostsStruct from "../struct/Posts";

const PostRequests = {
    get(data, callback) {
        let query = PostsStruct.get;
        query = {...data};
        let url = Microservices.Posts + Endpoints.Posts.Get;
        if (data.postId) {
            url = `${Microservices.Posts + Endpoints.Posts.GetByPostId}${data.postId}/`;
            delete query.postId;
        }
        const axios_config = {
            url,
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
    delete(postId, access_token, callback) {
        const axios_config = {
            url: `${Microservices.Posts + Endpoints.Posts.Delete}${postId}/`,
            method: 'DELETE',
            timeout: Microservices.GlobalTimeout,
        };
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                'Authorization': 'Bearer ' + access_token
            };
        }
        axios.request(axios_config)
            .then(response => {
                callback(true, response);
            })
            .catch(error => {
                callback(false, error);
            });
    },

    create(data, callback, access_token) {
        const axios_config = {
            url: Microservices.Posts + Endpoints.Posts.Create,
            data: data,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios_config.headers = {"Content-Type": "multipart/form-data"}
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                'Authorization': 'Bearer ' + access_token
            };
        }

        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },
    put(postId, data, callback, access_token) {
        const axios_config = {
            url: `${Microservices.Posts + Endpoints.Posts.Delete}${postId}/`,
            data: data,
            method: 'PUT',
            timeout: Microservices.GlobalTimeout,
        };
        axios_config.headers = {"Content-Type": "multipart/form-data"}
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                'Authorization': 'Bearer ' + access_token
            };
        }
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },
    getById(data, callback) {
        let query = PostsStruct.getById;
        query = {...data};
        const axios_config = {
            url: Microservices.Posts + Endpoints.Posts.GetByUserID + query.user_id + '/',
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
    getPostBySubscriptions(data, callback) {
        let query = PostsStruct.getBySubscribers;
        query = {...data};
        const axios_config = {
            url: Microservices.Posts + Endpoints.Posts.GetBySubscriptions + query.user_ids + '/',
            data: query,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },
    likeToggle(user_id, post_id, callback) {
        const axios_config = {
            url: Microservices.Posts + Endpoints.Like.Create,
            data: {user_id, post_id},
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        });
    },
    likeByUser(userId, callback) {
        const axios_config = {
            url: `${Microservices.Posts + Endpoints.Like.GetUserLikes}${userId}/`,
            method: 'GET',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config)
            .then(response => {
                callback(true, response);
            })
            .catch(error => {
                callback(false, error);
            });
    }
}
export default PostRequests;
