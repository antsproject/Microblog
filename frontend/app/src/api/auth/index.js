import Endpoints from '../endpoints';
import { axiosInstance } from '../instance';

export const login = (params) => axiosInstance.post(Endpoints.AUTH.LOGIN, params);
