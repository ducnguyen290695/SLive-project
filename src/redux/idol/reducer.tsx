import { combineReducers } from 'redux';
import { generateReducer } from '@/src/utils/redux/generator';
import actions from './actions';

const changeStatusState = {
  changeError: null,
  changing: null,
  changeSuccess: null,
};

const [fetch, , update, _delete] = generateReducer('idol');

function changeStatus(state = changeStatusState, action) {
  switch (action.type) {
    case actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_REQUEST:
      return {
        ...state,
        changing: true,
      };
    case actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_SUCCESS:
      return {
        ...state,
        changing: false,
        changeSuccess: true,
      };
    case actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_FAILURE:
      return {
        ...state,
        changeError: action.error,
        changing: false,
        changeSuccess: false,
      };
    case actions.CHANGE_STATUS.CHANGE_IDOL_STATUS_CLEANUP:
      return {
        ...state,
        changeError: null,
        changing: null,
        changeSuccess: null,
      };

    default:
      return state;
  }
}

const idolReducer = combineReducers({
  fetch,
  update,
  _delete,
  changeStatus,
});

export default idolReducer;
