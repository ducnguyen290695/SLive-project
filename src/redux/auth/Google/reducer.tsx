import actions from './actions';

const initialState = {
  isLogined: false,
  googleError: null,
  data: null,
  googleLoading: false,
};

export default function googleLogin(state = initialState, action) {
  switch (action.type) {
    case actions.GOOGLE_LOGIN_REQUEST:
      return {
        ...state,
        isLogined: false,
        idToken: action.idToken,
        googleLoading: true,
      };
    case actions.GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        isLogined: true,
        data: action.data,
        googleLoading: false,
      };
    case actions.GOOGLE_LOGIN_FAILURE:
      return {
        ...state,
        isLogined: false,
        googleError: action.error,
        googleLoading: false,
      };
    case actions.GOOGLE_LOGIN_CLEANUP:
      return {
        ...state,
        isLogined: null,
        googleError: null,
        googleLoading: null,
      };
    default:
      return state;
  }
}
