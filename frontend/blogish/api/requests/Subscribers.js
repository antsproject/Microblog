import Endpoints from '../Endpoints'
import axios from "axios";
import Microservices from "../Microservices";
import UsersStruct from "../struct/Users";
import SubscribesStruct from "../struct/Users";
import Storage from '../storage/Storage';


const SubscribersRequests = {
	getUserSubscribers(data, callback) {
		let query = UsersStruct.get;
		query = {...data};
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
	},
	subscribe(data, callback) {
	    let query = SubscribesStruct.subscribe;
		query = {...data};
		const axios_config = {
		    url: `${Microservices.Users}${Endpoints.Subscribers.Subscribe}`,
			data: query,
			method: 'POST',
			timeout: Microservices.GlobalTimeout,
		};
		const access_token = Storage.getToken();
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
	}
}

export default SubscribersRequests;