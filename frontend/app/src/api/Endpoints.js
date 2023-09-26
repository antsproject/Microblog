const Endpoints = {
    Users: {
        Login: 'api/auth/token/',
        Register: 'api/users/',
        Get: 'api/users/'
    },
    Posts: {
        Get: 'api/post/',
        Create: 'api/post/',
        Patch: 'api/post/<int:pk>/',
    },
    Category: {
        Get: 'api/category/',
        Create: 'api/category/',
        Patch: 'api/category/<int:pk>/'
    },
    Likes: {
        Get: 'api/post/<int:pk>/likes/',
        Create: 'api/post/<int:pk>/like/'
    },
    Subscribers: {
        UserSubscribersGet: 'api/subscriptions/?from-id='
    }
};
export default Endpoints;
