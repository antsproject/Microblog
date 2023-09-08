import axios from 'axios';

export function login(email, password) {
  axios
    .post('http://localhost:8080/api/users/', {
      email: email,
      password: password,
    })
    .then((response) => {
      response.data;
      console.log(response, 'response');
    })
    .catch((error) => alert(error.message, 'Что то пошло не так'));
  alert('Done!');
}
