import Endpoints from '../Endpoints'
import axios from "axios";
import Microservices from "../Microservices";
import UsersStruct from "../struct/Users";

const SubscribersRequests = {
    getUserSubscribers (data, callback) {
        let query = UsersStruct.get;
        query = { ...data }
        const axios_config = {
            url: `${Microservices.Users}${Endpoints.Subscribers.UserSubscribersGet}${query.userId}`,
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

export default SubscribersRequests;