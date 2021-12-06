import { combineReducers } from 'redux';
import { generateReducer } from '@/src/utils/redux/generator';

const [fetch] = generateReducer('rank');

const rankReducer = combineReducers({
  fetch,
});

export default rankReducer;
