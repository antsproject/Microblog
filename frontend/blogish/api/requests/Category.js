import axios from "axios";
import Endpoints from "../Endpoints";
import Microservices from "../Microservices";
import CategoryStruct from "../struct/Category";


const CategoryRequests = {
    get(data, callback) {
        let query = CategoryStruct.get;
        query = {...data};
        const axios_config = {
            url: `${Microservices.Posts}/${Endpoints.Category.Get}`,
            data: query,
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
export default CategoryRequests;
