const Endpoints = {
	Users: {
		Login: 'api/auth/token/',
		Register: 'api/users/',
		Get: 'api/users/'
	},
	Posts: {
		Get: 'api/post/',
		Create: 'api/post/',
		Put: 'api/post/',
		Patch: 'api/post/',
		Delete: 'api/post/'
	},
	Category: {
		Get: 'api/category/',
		Create: 'api/category/',
		Patch: 'api/category/',
		Delete: 'api/category/'
	},
	Like: {
		Create: 'api/post/like/',
		GetPostLikes: 'api/post/p-likes/',
		GetUserLikes: 'api/post/u-likes/'
	},
	Subscribers: {
		UserSubscribersGet: 'api/subscriptions/',
		Subscribe: 'api/subscriptions/'
	}
};
export default Endpoints;
