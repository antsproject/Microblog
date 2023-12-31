import axios from 'axios';
import Endpoints from '../Endpoints';
import Microservices from '../Microservices';
import UsersStruct from '../struct/Users';
import Storage from '../storage/Storage';

const UserRequests = {

    login(data, callback) {
        let query = UsersStruct.login;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + '' + Endpoints.Users.Login,
            data: query,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config).then(response => {
            Storage.setToken(response.data.access);
            Storage.setUserId(response.data.id);

            let query = UsersStruct.get;
            query.userId = response.data.id;

            UserRequests.get(query, function (success, response) {
                console.debug(success, response);
                if (success === true) {
                    // setUser(response.data);
                    Storage.setUser(response.data);
                    callback(true, response);
                }
                else {
                    callback(false, response);
                }
            });
        }).catch(function (error) {
            callback(false, error);
        });
    },
    register(data, callback) {
        let query = UsersStruct.register;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + '' + Endpoints.Users.Register,
            data: query,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config).then(response => {
            // Storage.setToken(response.data.access);
            // Storage.setUserId(response.data.id);
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },
    get(data, callback) {
        let query = UsersStruct.get;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + '' + Endpoints.Users.Get + '' + query.userId + '/',
            method: 'GET',
            timeout: Microservices.GlobalTimeout,
        };
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    }
}
export default UserRequests;
