import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Context, createWrapper } from 'next-redux-wrapper';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducer';
import rootSaga from './saga';

const makeStore: any = (context: Context) => {
  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Add an extra parameter for applying middleware:
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware)),
  );

  // 3: Run your sagas on server
  sagaMiddleware.run(rootSaga);

  // 4: return the store:
  return store;
};

export type RootState = ReturnType<typeof makeStore.getState>;
export const wrapper = createWrapper(makeStore as any);
