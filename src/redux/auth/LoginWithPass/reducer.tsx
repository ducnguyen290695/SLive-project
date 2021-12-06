import actions from './actions';

const initialState = {
  isLogined: false,
  loginError: null,
  data: null,
  loginLoading: null,
  user_role: null,
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        isLogined: false,
        loginLoading: true,
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isLogined: true,
        data: action.data,
        loginLoading: false,
      };
    case actions.LOGIN_FAILURE:
      return {
        ...state,
        isLogined: false,
        loginError: action.error,
        loginLoading: false,
      };
    case actions.LOGIN_CLEANUP:
      return {
        ...state,
        isLogined: null,
        loginError: null,
        loginLoading: null,
      };
    case actions.GET_USER_ROLE_SUCCESS:
      return {
        ...state,
        user_role: action.data,
      };
    default:
      return state;
  }
}
