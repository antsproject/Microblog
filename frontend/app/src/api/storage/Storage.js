const Storage = {
    setToken(token) {
        localStorage.setItem('accessToken', token);
    },
    getToken() {
        return localStorage.getItem('accessToken');
    }
}
export default Storage;