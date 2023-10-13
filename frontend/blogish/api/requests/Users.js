import axios from 'axios';
import Endpoints from '../Endpoints';
import Microservices from '../Microservices';
import UsersStruct from '../struct/Users';
import fetchJson from '../../session/fetchJson';

const UserRequests = {
    login(data, callback) {
        let query = UsersStruct.login;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + Endpoints.Users.Login,
            data: query,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios
            .request(axios_config)
            .then((response) => {
                let query = UsersStruct.get;
                query.userId = response.data.id;

                UserRequests.get(query, function (success, response) {
                    console.debug(success, response);
                    if (success === true) {
                        // setUser(response.data);
                        // Storage.setUser(response.data);
                        callback(true, response);
                    } else {
                        callback(false, response);
                    }
                });
            })
            .catch(function (error) {
                callback(false, error);
            });
    },
    register(data, callback) {
        let query = UsersStruct.register;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + Endpoints.Users.Register,
            data: query,
            method: 'POST',
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
    get(data, callback) {
        let query = UsersStruct.get;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + Endpoints.Users.Get + query.userId + '/',
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

    patchStatus(user_id, data, access_token, callback) {
        let query = UsersStruct.patch;
        const axios_config = {
            url: Microservices.Users + Endpoints.Users.Patch + user_id + '/',
            data: { status: data },
            method: 'PATCH',
            timeout: Microservices.GlobalTimeout,
        };
        axios_config.headers = { "Content-Type": "application/json" }
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                'Authorization': 'Bearer ' + access_token
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

    patchUsername(user_id, data, access_token, callback) {
        let query = UsersStruct.patch;
        const axios_config = {
            url: Microservices.Users + Endpoints.Users.Patch + user_id + '/',
            data: { username: data },
            method: 'PATCH',
            timeout: Microservices.GlobalTimeout,
        };
        axios_config.headers = { "Content-Type": "application/json" }
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                'Authorization': 'Bearer ' + access_token
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


    async patchAvatar(user_id, data, access_token, callback) {

        const success = await fetchJson(Microservices.Users + Endpoints.Users.Patch + user_id + '/', {
            method: "PATCH",
            headers: { 'Authorization': 'Bearer ' + access_token },
            body: data
        });

        callback(true, success);

        //    const axios_config = {
        //        url: Microservices.Users + Endpoints.Users.Patch + user_id + '/',
        //        data: data,
        //        method: 'PATCH',
        //        timeout: Microservices.GlobalTimeout,
        //    };
        //    axios_config.headers = { "Content-Type": "multipart/form-data" }
        //    if (access_token) {
        //        axios_config.headers = {
        //            ...axios_config.headers,
        //            'Authorization': 'Bearer ' + access_token
        //        };
        //    }

        //    axios.request(axios_config).then((response) => {
        //        callback(true, response);
        //    }).catch(function (error) {
        //        callback(false, error);
        //    });
    },
};
export default UserRequests;
