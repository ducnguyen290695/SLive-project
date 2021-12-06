import { combineReducers } from 'redux';
import { generateReducer } from '@/src/utils/redux/generator';

const [fetchAddress] = generateReducer('address');

const commonReducer = combineReducers({
  fetchAddress,
});

export default commonReducer;
