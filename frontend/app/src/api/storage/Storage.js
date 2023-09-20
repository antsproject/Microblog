const Storage = {
    setToken(token) {
        localStorage.setItem('accessToken', token);
    },
    getToken() {
        return localStorage.getItem('accessToken');
    },
    setUserId(userId) {
        localStorage.setItem('userId', userId);
    },
    getUserId() {
        return localStorage.getItem('userId');
    }
}
export default Storage;