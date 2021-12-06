import actions from './actions';
import { combineReducers } from 'redux';

const updateState = {
  updateError: null,
  updating: null,
  updateSuccess: null,
};

const fetchState = {
  fetchError: null,
  fetching: null,
  fetchSuccess: null,
  data: null,
};

const deleteState = {
  deleteError: null,
  deleting: null,
  deleteSuccess: null,
};

const searchState = {
  searchError: null,
  searching: null,
  searchSuccess: null,
};

export function fetch(state = fetchState, action) {
  switch (action.type) {
    case actions.FETCH.FETCH_USERS_REQUEST:
      return {
        ...state,
        fetching: true,
      };
    case actions.FETCH.FETCH_USERS_SUCCESS:
      return {
        ...state,
        fetching: false,
        fetchSuccess: true,
        data: action.payload,
      };
    case actions.FETCH.FETCH_USERS_FAILURE:
      return {
        ...state,
        fetchError: action.error,
        fetching: false,
        fetchSuccess: false,
      };
    case actions.FETCH.FETCH_USERS_CLEANUP:
      return {
        ...state,
        fetchError: null,
        fetching: null,
        fetchSuccess: null,
        action: null,
      };
    default:
      return state;
  }
}

export function update(state = updateState, action) {
  switch (action.type) {
    case actions.UPDATE.UPDATE_USER_REQUEST:
      return {
        ...state,
        updating: true,
      };
    case actions.UPDATE.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updating: false,
        updateSuccess: true,
      };
    case actions.UPDATE.UPDATE_USER_FAILURE:
      return {
        ...state,
        updateError: action.error,
        updating: false,
        updateSuccess: false,
      };
    case actions.UPDATE.UPDATE_USER_CLEANUP:
      return {
        ...state,
        updateError: null,
        updating: false,
        updateSuccess: false,
      };
    default:
      return state;
  }
}

export function _delete(state = deleteState, action) {
  switch (action.type) {
    case actions.DELETE.DELETE_USER_REQUEST:
      return {
        ...state,
        deleting: true,
      };
    case actions.DELETE.DELETE_USER_SUCCESS:
      return {
        ...state,
        deleting: false,
        deleteSuccess: true,
      };
    case actions.DELETE.DELETE_USER_FAILURE:
      return {
        ...state,
        deleteError: action.error,
        deleting: false,
        deleteSuccess: false,
      };
    case actions.DELETE.DELETE_USER_CLEANUP:
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

export function search(state = searchState, action) {
  switch (action.type) {
    case actions.SEARCH.SEARCH_USER_REQUEST:
      return {
        ...state,
        searching: true,
      };
    case actions.SEARCH.SEARCH_USER_SUCCESS:
      return {
        ...state,
        searching: false,
        searchSuccess: true,
      };
    case actions.SEARCH.SEARCH_USER_FAILURE:
      return {
        ...state,
        searchError: action.error,
        searching: false,
        searchSuccess: false,
      };
    case actions.SEARCH.SEARCH_USER_CLEANUP:
      return {
        ...state,
        searchError: null,
        searching: null,
        searchSuccess: null,
      };
    default:
      return state;
  }
}

const userReducer = combineReducers({
  fetch,
  update,
  _delete,
});

export default userReducer;
