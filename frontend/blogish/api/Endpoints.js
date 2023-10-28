const Endpoints = {
    Users: {
        Login: 'api/auth/token/',
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
        Search: 'api/post/search/'
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
    Favorite: {
        Create: 'api/post/favorite/',
        GetUserFavorite: 'api/post/u-favorite/',
    },
    Subscribers: {
        UserSubscribersStatus: 'api/subscriptions/',
        Subscribe: 'api/subscriptions/',
        UserSubscriptionsList: '/api/subscriptions/from/',
    },
    Comments: {
        Get: 'api/comments/by-post/',
        GetChildren: 'api/comments/children/?parent_id=',
        Create: 'api/comments/',
        Patch: 'api/comments/',
        Delete: 'api/comments/',
    },
    Supports: {
        GetComplain: 'api/complain/',
        GetComplainPost: 'api/complain_post/is_active=True/',
        CreatePostComplain: 'api/complain_post/',
    }
};
export default Endpoints;
