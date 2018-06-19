import { combineReducers } from 'redux';
import configureStore from './CreateStore';
//import naviReducer from './NavigationRedux';
import startupReducer from './StartupRedux';
import loginReducer from './LoginRedux';
import chatReducer from './ChatRedux';
import channelReducer from './ChannelRedux';

//import rootSaga from '../Sagas/';


export default () => {
  /* ------------- Assemble The Reducers ------------- */
  const rootReducer = combineReducers({
    nav: require('./NavigationRedux').reducer,
    startup: startupReducer,
    chats:require('./ChatsRedux').reducer,
    user: loginReducer,
    chat: chatReducer,
    channel: channelReducer
  });

  //return configureStore(rootReducer, rootSaga);
  return configureStore(rootReducer, null);
}
