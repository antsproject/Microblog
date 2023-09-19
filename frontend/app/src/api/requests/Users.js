import axios from "axios";
import Endpoints from '../Endpoints'
import Microservices from "../Microservices";
import UsersStruct from "../struct/Users";

const UserRequests = {
    // accessToken: '',
    login(data, callback) {
        let query = UsersStruct.login;
        query = { ...data };
        const axios_config = {
            url: Microservices.Users + '' + Endpoints.Users.Login,
            data: query,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        // axios_config.headers = {};
        axios.request(axios_config).then(response => {
            console.debug("success login");
            // UserRequests.accessToken = response.data.access;
            localStorage.setItem('accessToken', response.data.access);
            callback(true, response);
        }).catch(function (error) {
            // console.error(error);
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
        // axios_config.headers = {};
        axios.request(axios_config).then(response => {
            console.debug("success register");
            localStorage.setItem('accessToken', response.data.access);
            // UserRequests.accessToken = response.data.access;
            callback(true, response);
        }).catch(function (error) {
            // console.error(error);
            callback(false, error);
        })
    }
}
export default UserRequests;
