import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchAddressRest = () => {
  return api.get({
    url: `${API_URL.ADDRESS_API_URL}`,
  });
};
