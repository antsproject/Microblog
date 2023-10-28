import axios from "axios";
import Endpoints from "../Endpoints";
import Microservices from "../Microservices";
import ComplainStruct from "../struct/Complain";


const ComplainRequests = {
    get(data, callback, access_token) {
        let query = ComplainStruct.get;
        query = { ...data };

        const axios_config = {
            url: Microservices.Support + Endpoints.Supports.GetComplain,
            data: query,
            method: 'GET',
            timeout: Microservices.GlobalTimeout,
        };
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                Authorization: 'Bearer ' + access_token,
            };
        }
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },

    create(data, callback, access_token) {
        let query = ComplainStruct.create;
        query = { ...data };
        console.table(query)
        const axios_config = {
            url: Microservices.Support + Endpoints.Supports.CreatePostComplain,
            data: query,
            method: 'POST',
            timeout: Microservices.GlobalTimeout,
        };
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                Authorization: 'Bearer ' + access_token,
            };
        }
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },
    update(complain_id, data, callback, access_token) {
        let query = ComplainStruct.create;
        query = { ...data };
        console.table(query)
        const axios_config = {
            url: Microservices.Support + Endpoints.Supports.CreatePostComplain + complain_id + '/',
            data: query,
            method: 'PUT',
            timeout: Microservices.GlobalTimeout,
        };
        if (access_token) {
            axios_config.headers = {
                ...axios_config.headers,
                Authorization: 'Bearer ' + access_token,
            };
        }
        axios.request(axios_config).then(response => {
            callback(true, response);
        }).catch(function (error) {
            callback(false, error);
        })
    },
}
export default ComplainRequests;
