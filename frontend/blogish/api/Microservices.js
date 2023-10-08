import Endpoints from "./Endpoints";

const Microservices = {
    GlobalTimeout: 2500,
    // Users: 'http://localhost:8080/',
    // Posts: 'http://localhost:8082/',
    // Comments: 'http://localhost:8083/',
    // Support: 'http://localhost:8084/'
    Users: process.env.USERS_MICROSERVICE_URL,
    Users_server: process.env.USERS_SERVER_MICROSERVICE_URL,

    Posts: process.env.POSTS_MICROSERVICE_URL,
    Posts_server: process.env.POSTS_SERVER_MICROSERVICE_URL,

    Comments: process.env.COMMENTS_MICROSERVICE_URL,
    Comments_server: process.env.COMMENTS_SERVER_MICROSERVICE_URL,

    Support: process.env.SUPPORT_MICROSERVICE_URL,
    Support_server: process.env.SUPPORT_SERVER_MICROSERVICE_URL,
};
export default Microservices;
