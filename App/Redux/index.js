import { combineReducers } from 'redux';
import configureStore from './CreateStore';
//import naviReducer from './NavigationRedux';
import startupReducer from './StartupRedux';

import rootSaga from '../Sagas/';


export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    nav: require('./NavigationRedux').reducer,
    startup: startupReducer,
    chats:require('./ChatsRedux').reducer,
  })

  return configureStore(rootReducer, rootSaga)
}
