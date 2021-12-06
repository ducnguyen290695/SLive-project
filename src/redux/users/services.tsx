import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchUsersRest = params => {
  return api.get({
    url: `${API_URL.USER_API_URL}`,
    params: params,
  });
};

export const updateUserRest = ({ id, payload }) => {
  return api.put({
    url: `${API_URL.USER_API_URL}/${id}`,
    payload: payload,
  });
};

export const deleteUserRest = id => {
  return api.delete({
    url: `${API_URL.USER_API_URL}/${id}`,
  });
};

// export const searchUserRest = params => {
//   return api.get({
//     url: `${API_URL.USER_API_URL}`,
//     params: params,
//   });
// };
