import { BASE_URL } from '../utils/urlConfig';

export const FORM_LAYOUT = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

export const SEARCH_FORM_LAYOUT = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
};

export const API_URL = {
  FACEBOOK_API_URL: BASE_URL + '/users/facebook',
  GOOGLE_API_URL: BASE_URL + '/users/google',
  LOGIN_URL: BASE_URL + '/users/login-with-password',
  USER_API_URL: BASE_URL + '/users',
  GIFT_API_URL: BASE_URL + '/gifts',
  RANK_API_URL: BASE_URL + '/ranks',
  CURRENT_USER_API_URL: BASE_URL + '/users/me',
  UPDATE_CURRENT_USER_API_URL: BASE_URL + '/users/update-profile',
  UPLOAD_AVATAR_API_URL: BASE_URL + '/image/upload-avatar',
  UPLOAD_COVER_API_URL: BASE_URL + '/image/upload-cover',
  ADDRESS_API_URL: BASE_URL + '/systems/addresses',
  ROLE_API_URL: BASE_URL + '/roles/user-roles',
};

export const ACCESS_TOKEN = 'access_token';
export const USER_ID = 'user_id';

export const FORM_ACTION_TYPE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
};

export const PHONE_NUMBER_PATTERN = '[0]{1}[0-9]{9}';

export const DATE_FORMAT = 'DD-MM-YYYY';

export const DATE_FORMAT_API = 'YYYY-MM-DD';

export const USER_ACTION_TYPE = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
};

export const INPUT_TYPE = {
  TEXT_AREA: 'TEXT_AREA',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  INPUT: 'INPUT',
  MASKED_INPUT: 'MASKED_INPUT',
  DATE_PICKER: 'DATE_PICKER',
  PASSWORD: 'PASSWORD',
  IMAGE_UPLOAD: 'IMAGE_UPLOAD',
  PHONE_INPUT: 'PHONE_INPUT',
  RANGE_PICKER: 'RANGE_PICKER',
  BUTTON_GROUP: 'BUTTON_GROUP',
  PHONE_NUMBER_INPUT: 'PHONE_NUMBER_INPUT',
};

export const LOGIN_ID = {
  GOOGLE_ID: '138330932443-03hde88jpjvvgefee2490pptopknq7cv.apps.googleusercontent.com',
  FACEBOOK_ID: '1360134131026956',
};

export const PAGE_SIZE_LIST = [20, 50, 100, 500, 1000];

export const GENDER = {
  MALE: {
    LABEL: 'Male',
    VALUE: 1,
  },
  FEMALE: {
    LABEL: 'Female',
    VALUE: 0,
  },
};

export const ROLES = {
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  USER: 'user',
  HOST: 'host',
  MANAGER: 'manager',
};
