import { fork, takeLatest } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

//import { StartupTypes } from '../Redux/StartupRedux'
import { FETCH_CHATS } from '../Redux/ChatsRedux';

/* ------------- Sagas ------------- */

import { startDoppioSaga } from './StartupSagas';
//import { getUserAvatar } from './GithubSagas';
import {getChats} from './ChatsSaga';


/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  console.log("-XXX->Saga root running!");
  yield [
    fork(startDoppioSaga),
    // some sagas only receive an action
    //takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    //takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api)
    takeLatest(FETCH_CHATS, getChats, api)
  ]
}
