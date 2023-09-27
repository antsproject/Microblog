import Microservices from '../api/Microservices'


const userUtils = {
    getAvatar (user)  {
        return Microservices.Users + '' + user.avatar;
    },
}

export default userUtils;