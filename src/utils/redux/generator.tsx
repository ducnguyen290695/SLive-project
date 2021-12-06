import { call, put } from 'redux-saga/effects';

export const generateState = () => {
  const createState = {
    createError: null,
    creating: null,
    createSuccess: null,
  };

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

  return {
    createState,
    updateState,
    fetchState,
    deleteState,
  };
};

export const generateActions = (modelName: string) => {
  return [
    {
      FETCH_REQUEST: `FETCH_${modelName.toUpperCase()}_REQUEST`,
      FETCH_SUCCESS: `FETCH_${modelName.toUpperCase()}_SUCCESS`,
      FETCH_FAILURE: `FETCH_${modelName.toUpperCase()}_FAILURE`,
      FETCH_CLEANUP: `FETCH_${modelName.toUpperCase()}_CLEANUP`,
    },
    {
      CREATE_REQUEST: `CREATE_${modelName.toUpperCase()}_REQUEST`,
      CREATE_SUCCESS: `CREATE_${modelName.toUpperCase()}_SUCCESS`,
      CREATE_FAILURE: `CREATE_${modelName.toUpperCase()}_FAILURE`,
      CREATE_CLEANUP: `CREATE_${modelName.toUpperCase()}_CLEANUP`,
    },
    {
      UPDATE_REQUEST: `UPDATE_${modelName.toUpperCase()}_REQUEST`,
      UPDATE_SUCCESS: `UPDATE_${modelName.toUpperCase()}_SUCCESS`,
      UPDATE_FAILURE: `UPDATE_${modelName.toUpperCase()}_FAILURE`,
      UPDATE_CLEANUP: `UPDATE_${modelName.toUpperCase()}_CLEANUP`,
    },
    {
      DELETE_REQUEST: `DELETE_${modelName.toUpperCase()}_REQUEST`,
      DELETE_SUCCESS: `DELETE_${modelName.toUpperCase()}_SUCCESS`,
      DELETE_FAILURE: `DELETE_${modelName.toUpperCase()}_FAILURE`,
      DELETE_CLEANUP: `DELETE_${modelName.toUpperCase()}_CLEANUP`,
    },
  ];
};

export const generateReducer = (modelName: string) => {
  const { createState, fetchState, updateState, deleteState } = generateState();
  const [FETCH, CREATE, UPDATE, DELETE] = generateActions(modelName);

  function fetch(state = fetchState, action) {
    switch (action.type) {
      case FETCH.FETCH_REQUEST:
        return {
          ...state,
          fetching: true,
        };
      case FETCH.FETCH_SUCCESS:
        return {
          ...state,
          fetching: false,
          fetchSuccess: true,
          data: action.payload,
        };
      case FETCH.FETCH_FAILURE:
        return {
          ...state,
          fetchError: action.error,
          fetching: false,
          fetchSuccess: false,
        };
      case FETCH.FETCH_CLEANUP:
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

  function create(state = createState, action) {
    switch (action.type) {
      case CREATE.CREATE_REQUEST:
        return {
          ...state,
          creating: true,
        };
      case CREATE.CREATE_SUCCESS:
        return {
          ...state,
          creating: false,
          createSuccess: true,
        };
      case CREATE.CREATE_FAILURE:
        return {
          ...state,
          createError: action.error,
          creating: false,
          createSuccess: false,
        };
      case CREATE.CREATE_CLEANUP:
        return {
          ...state,
          createError: null,
          creating: null,
          createSuccess: null,
        };
      default:
        return state;
    }
  }

  function update(state = updateState, action) {
    switch (action.type) {
      case UPDATE.UPDATE_REQUEST:
        return {
          ...state,
          updating: true,
        };
      case UPDATE.UPDATE_SUCCESS:
        return {
          ...state,
          updating: false,
          updateSuccess: true,
        };
      case UPDATE.UPDATE_FAILURE:
        return {
          ...state,
          updateError: action.error,
          updating: false,
          updateSuccess: false,
        };
      case UPDATE.UPDATE_CLEANUP:
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
      case DELETE.DELETE_REQUEST:
        return {
          ...state,
          deleting: true,
        };
      case DELETE.DELETE_SUCCESS:
        return {
          ...state,
          deleting: false,
          deleteSuccess: true,
        };
      case DELETE.DELETE_FAILURE:
        return {
          ...state,
          deleteError: action.error,
          deleting: false,
          deleteSuccess: false,
        };
      case DELETE.DELETE_CLEANUP:
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

  return [fetch, create, update, _delete];
};

export const generateSaga = ({ modelName, fetchApi, createApi, updateApi, deleteApi }) => {
  const [FETCH, CREATE, UPDATE, DELETE] = generateActions(modelName);

  function* fetch(action) {
    try {
      const response = yield call(fetchApi, action.payload);
      yield put({
        type: FETCH.FETCH_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      yield put({ type: FETCH.FETCH_FAILURE, error });
    }
  }

  function* create(action) {
    try {
      yield call(createApi, action.payload);
      yield put({
        type: CREATE.CREATE_SUCCESS,
      });
    } catch (error) {
      yield put({ type: CREATE.CREATE_FAILURE, error });
    }
  }

  function* update(action) {
    try {
      yield call(updateApi, action.payload);
      yield put({
        type: UPDATE.UPDATE_SUCCESS,
      });
    } catch (error) {
      yield put({ type: UPDATE.UPDATE_FAILURE, error });
    }
  }

  function* _delete(action) {
    try {
      yield call(deleteApi, action.payload);
      yield put({
        type: DELETE.DELETE_SUCCESS,
      });
    } catch (error) {
      yield put({ type: DELETE.DELETE_FAILURE, error });
    }
  }

  return [fetch, create, update, _delete];
};
