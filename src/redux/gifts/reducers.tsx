import actions from './actions';
import { combineReducers } from 'redux';

const createState = {
  createError: null,
  creating: null,
  createSuccess: null,
};

const listState = {
  fetchError: null,
  fetching: null,
  fetchSuccess: null,
  data: null,
};

const updateState = {
  updateError: null,
  updating: null,
  updateSuccess: null,
};

const deleteState = {
  deleteError: null,
  deleting: null,
  deleteSuccess: null,
};

function list(state = listState, action) {
  switch (action.type) {
    case actions.FETCH.FETCH_GIFTS_REQUEST:
      return {
        ...state,
        fetching: true,
      };
    case actions.FETCH.FETCH_GIFTS_SUCCESS:
      return {
        ...state,
        data: action.data,
        fetching: false,
        fetchSuccess: true,
      };
    case actions.FETCH.FETCH_GIFTS_FAILURE:
      return {
        ...state,
        fetchError: action.error,
        fetching: false,
        fetchSuccess: false,
      };
    case actions.FETCH.FETCH_GIFTS_CLEANUP:
      return {
        ...state,
        fetchError: null,
        fetching: null,
        data: null,
        fetchSuccess: null,
      };

    default:
      return state;
  }
}

function create(state = createState, action) {
  switch (action.type) {
    case actions.CREATE.CREATE_GIFT_REQUEST:
      return {
        ...state,
        creating: true,
      };
    case actions.CREATE.CREATE_GIFT_SUCCESS:
      return {
        ...state,
        data: action.data,
        creating: false,
        createSuccess: true,
      };
    case actions.CREATE.CREATE_GIFT_FAILURE:
      return {
        ...state,
        createError: action.error,
        creating: false,
        createSuccess: false,
      };
    case actions.CREATE.CREATE_GIFT_CLEANUP:
      return {
        ...state,
        createError: null,
        creating: null,
        data: null,
        createSuccess: null,
      };

    default:
      return state;
  }
}

function update(state = updateState, action) {
  switch (action.type) {
    case actions.UPDATE.UPDATE_GIFT_REQUEST:
      return {
        ...state,
        updating: true,
      };
    case actions.UPDATE.UPDATE_GIFT_SUCCESS:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case actions.UPDATE.UPDATE_GIFT_FAILURE:
      return {
        ...state,
        updateError: action.error,
        updating: false,
        updateSuccess: false,
      };
    case actions.UPDATE.UPDATE_GIFT_CLEANUP:
      return {
        ...state,
        updateError: null,
        updating: null,
        updateSuccess: null,
      };
    default:
      return state;
  }
}

function _delete(state = deleteState, action) {
  switch (action.type) {
    case actions.DELETE.DELETE_GIFT_REQUEST:
      return {
        ...state,
        deleting: true,
      };
    case actions.DELETE.DELETE_GIFT_SUCCESS:
      return {
        ...state,
        deleting: false,
        deleteSuccess: true,
      };
    case actions.DELETE.DELETE_GIFT_FAILURE:
      return {
        ...state,
        deleteError: action.error,
        deleting: false,
        deleteSuccess: false,
      };
    case actions.DELETE.DELETE_GIFT_CLEANUP:
      return {
        ...state,
        deleteError: null,
        deleting: null,
        deleteSuccess: null,
      };
    default:
      return state;
  }
}

const giftReducer = combineReducers({
  list,
  create,
  update,
  _delete,
});

export default giftReducer;
