import { takeLatest, put, select } from 'redux-saga/effects'

//import GithubActions from '../Redux/GithubRedux'
//import StatupActions from '../Redux/StartupRedux'
import INIT_DOPPIO from '../Redux/StartupRedux'

import { is } from 'ramda'

//import DoppioClient from '../../doppiosdk/doppio'


//export var doppioClient;

function callStartDoppio() {
  console.log('-Saga->callStartDoppio!');
  //doppioClient = new DoppioClient({appId: AppConfig.appId});
}

export function* startDoppioSaga() {
  console.log('-Saga->callStartDoppio!');
  yield* takeLatest(INIT_DOPPIO, callStartDoppio);
}

// exported to make available for tests
//export const selectAvatar = (state) => state.github.avatar

// process STARTUP actions
/*
export function * startup (action) {
  console.log("-Saga->startup, actionType: "+action.type);

  if (__DEV__ && console.tron) {
    console.log("-Saga->startup, With TRON!");        
    // straight-up string logging
    console.tron.log('Hello, I\'m an example of how to log via Reactotron.')

    // logging an object for better clarity
    console.tron.log({
      message: 'pass objects for better logging',
      someGeneratorFunction: selectAvatar
    })

    // fully customized!
    const subObject = { a: 1, b: [1, 2, 3], c: true }
    subObject.circularDependency = subObject // osnap!
    console.tron.display({
      name: '🔥 IGNITE 🔥',
      preview: 'You should totally expand this',
      value: {
        '💃': 'Welcome to the future!',
        subObject,
        someInlineFunction: () => true,
        someGeneratorFunction: startup,
        someNormalFunction: selectAvatar
      }
    })
  } else {
    console.log("-Saga->startup, No TRON!");    
  }

  yield put(StatupActions.startup())
  const avatar = yield select(selectAvatar)
  // only get if we don't have it yet
  if (!is(String, avatar)) {
    yield put(GithubActions.userRequest('GantMan'))
  }
} */

