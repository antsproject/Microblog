import axios from 'axios';
import { API_URL } from '../http';

export function register(userData) {
  axios
    .post(`${API_URL}/api/users/`, userData)
    .then((response) => {
      console.log(response.data, 'response');
      alert('Регистрация прошла успешно');
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        console.log(error.response.data);
      } else {
        console.error('Что-то пошло не так:', error.message);
      }
    });
}

//export function register(username, email, password1, password2) {
//  axios
//    .post('http://localhost:8080/api/users/', {
//      username: username,
//      email: email,
//      password1: password1,
//      password2: password2,
//    })
//    .then((response) => {
//      response.data;
//      console.log(response, 'response');
//    })
//    .catch((error) => alert('Что то пошло не так'));
//  alert('Done!');
//}
