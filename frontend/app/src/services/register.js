import axios from 'axios';

export function register(username, email, password1, password2) {
  axios
    .post('http://localhost:8080/api/users/', {
      username: username,
      email: email,
      password1: password1,
      password2: password2,
    })
    .then((response) => {
      response.data;
      console.log(response, 'response');
    })
    .catch((error) => alert('Что то пошло не так'));
  alert('Done!');
}
