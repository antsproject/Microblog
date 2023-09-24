const Endpoints = {
    Users: {
        Login: 'api/auth/token/',
        Register: 'api/users/',
        Get: 'api/users/'
    },
    Posts: {
        Get: 'api/posts/',
        Create: 'api/posts/'
    },
    Subscribers: {
        UserSubscribersGet: 'api/subscriptions/?from-id='
    }
};
export default Endpoints;
