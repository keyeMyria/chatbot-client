import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
//import createSagaMiddleware from 'redux-saga';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */
  const middleware = []
  const enhancers = []

  /* ------------- Redux logger ---------------- */
  const loggerMiddleware = createLogger();
  middleware.push(loggerMiddleware)

  /* ------------- Saga Middleware ------------- */
  //const sagaMonitor = null;
  //const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  //middleware.push(sagaMiddleware)

  /* ------------- Thunk Middleware ------------- */
  middleware.push(thunk);

  /* ------------- Assemble Middleware ------------- */
  enhancers.push(applyMiddleware(...middleware))

  const store = createStore(
    rootReducer,
    {},
    compose(...enhancers));

  // kick off root saga
  //sagaMiddleware.run(rootSaga)

  return store
}
