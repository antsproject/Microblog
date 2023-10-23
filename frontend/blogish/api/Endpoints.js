const Endpoints = {
    Users: {
        Login: 'api/auth/token/',
        Refresh: 'api/auth/refresh/',
        Register: 'api/users/',
        Get: 'api/users/',
        Patch: 'api/users/',
        Delete: 'api/users/',
    },
    Posts: {
        Get: 'api/post/',
        GetByPostId: 'api/post/detail/',
        Create: 'api/post/',
        Put: 'api/post/detail/',
        Patch: 'api/post/detail/',
        Delete: 'api/post/detail/',
        GetByUserID: 'api/post/from-user/',
        GetBySubscriptions: 'api/post/filter/',
    },
    Category: {
        Get: 'api/category/',
        Create: 'api/category/',
        Patch: 'api/category/',
        Delete: 'api/category/',
    },
    Like: {
        Create: 'api/post/like/',
        GetPostLikes: 'api/post/p-likes/',
        GetUserLikes: 'api/post/u-likes/',
    },
    Subscribers: {
        UserSubscribersStatus: 'api/subscriptions/',
        Subscribe: 'api/subscriptions/',
        UserSubscriptionsList: '/api/subscriptions/from/',
    },
    Comments: {
        Get: 'api/comments/by-post/',
        Create: 'api/comments/',
        Patch: 'api/comments/',
        Delete: 'api/comments/',
    },
};
export default Endpoints;
