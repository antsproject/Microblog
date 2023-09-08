import api from '../../api';
import { loginFailure, loginStart, loginSuccess } from './authReducer';

export const loginUser = (data) => async (dispatch) => {
  try {
    dispatch(loginStart());

    const res = await api.auth.login(data);

    dispatch(loginSuccess(res.data.accessToken));
  } catch (event) {
    console.error(event);

    dispatch(loginFailure(event.message));
  }
};
