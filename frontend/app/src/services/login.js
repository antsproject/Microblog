import axios from 'axios';
import { API_URL } from '../http';
export function login(userData) {
  try {
    const response = axios.post(`${API_URL}/api/auth/token/`, userData);

    // Тут можно обработать ответ от сервера, например, сохраняем токен в куки
    console.log(response.data, 'response');
    return response.data;
  } catch (error) {
    console.error('Что-то пошло не так', error);
    //    throw error;
  }
}

//export function login(email, password) {
//  axios
//    .post('http://localhost:8080//api/auth/token/', {
//      email: email,
//      password: password,
//    })
//    .then((response) => {
//      response.data;
//      console.log(response, 'response');
//    })
//    .catch((error) => alert(error.message, 'Что то пошло не так'));
//  alert('Done!');
//}
