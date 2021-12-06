import { combineReducers } from 'redux';
import { generateReducer } from '@/src/utils/redux/generator';

const [fetch, create, , deleteRole] = generateReducer('role');

const roleReducer = combineReducers({
  fetch,
  create,
  deleteRole,
});

export default roleReducer;
