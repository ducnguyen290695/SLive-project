import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchGiftsRest = () => {
  return api.get({
    url: API_URL.GIFT_API_URL,
  });
};

export const updateGiftRest = ({ id, data }) => {
  return api.patch({
    url: `${API_URL.GIFT_API_URL}/${id}`,
    payload: data,
  });
};

export const createGiftRest = data => {
  return api.postUpload({
    url: API_URL.GIFT_API_URL,
    payload: data,
  });
};

export const deleteGiftRest = id => {
  return api.delete({
    url: `${API_URL.GIFT_API_URL}/${id}`,
  });
};
