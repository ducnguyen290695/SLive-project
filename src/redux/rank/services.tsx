import api from '@/src/utils/api';
import { API_URL } from '@/src/config/constants';

export const fetchRankRest = params => {
  return api.get({
    url: `${API_URL.RANK_API_URL}`,
    params,
  });
};
