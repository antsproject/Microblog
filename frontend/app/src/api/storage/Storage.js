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
    },
    setUser(data) {
        localStorage.setItem('currentUser', JSON.stringify(data));
    },
    getUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    },
    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
    }
}
export default Storage;