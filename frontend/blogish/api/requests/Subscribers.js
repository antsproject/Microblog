import Endpoints from '../Endpoints'
import axios from "axios";
import Microservices from "../Microservices";
// import UsersStruct from "../struct/Users";
import SubscribesStruct from "../struct/Users";
// import Storage from '../storage/Storage';


const SubscribersRequests = {
	getStatusSubscribe(data, callback) {
		let query = SubscribesStruct.subscribing;
		query = {...data};
		const axios_config = {
			url: `${Microservices.Users}${Endpoints.Subscribers.UserSubscribersGet}
			?from-id=${query.subscriber}&to-id=${query.subscribed_to}`,
			method: 'GET',
			timeout: Microservices.GlobalTimeout,
		};
		axios.request(axios_config).then(response => {
			callback(true, response);
		}).catch(function (error) {
			callback(false, error);
		})
	},
	subscribe(data, callback, access_token) {
	    let query = SubscribesStruct.subscribing;
		query = {...data};
		const axios_config = {
		    url: `${Microservices.Users}${Endpoints.Subscribers.Subscribe}`,
			data: query,
			method: 'POST',
			timeout: Microservices.GlobalTimeout,
		};
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

	unsubscribe(data, callback, access_token) {
		let query = SubscribesStruct.subscribing;
		query = {...data};
		const axios_config = {
			url: `${Microservices.Users}${Endpoints.Subscribers.Subscribe}`,
			data: query,
			method: 'DELETE',
			timeout: Microservices.GlobalTimeout,
		};
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
}

export default SubscribersRequests;