import actions from './actions';

const initialState = {
  isLogined: false,
  facebookError: null,
  data: null,
  facebookLoading: null,
};

export default function faceBookLogin(state = initialState, action) {
  switch (action.type) {
    case actions.FACEBOOK_LOGIN_REQUEST:
      return {
        ...state,
        isLogined: false,
        facebookLoading: true,
      };
    case actions.FACEBOOK_LOGIN_SUCCESS:
      return {
        ...state,
        isLogined: true,
        data: action.data,
        facebookLoading: false,
      };
    case actions.FACEBOOK_LOGIN_FAILURE:
      return {
        ...state,
        isLogined: false,
        facebookError: action.error,
        facebookLoading: false,
      };
    case actions.FACEBOOK_LOGIN_CLEANUP:
      return {
        ...state,
        isLogined: null,
        facebookError: null,
        facebookLoading: null,
      };
    default:
      return state;
  }
}
