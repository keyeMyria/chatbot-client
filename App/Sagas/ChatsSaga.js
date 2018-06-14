import { call, put } from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {FETCH_CHATS, FETCH_CHATS_SUCCESS, FETCH_CHATS_FAILURE} from '../Redux/ChatsRedux';

export function* getChats(api, action) {
  const userId = action.payload;

  // make the call to the api
  const response = yield call(api.getConversations, userId);
  //console.log("-XXX->getConversations response="+JSON.stringify(response));

  //Simulate async result, TODO need to move it to FixedAPI otherwise difficult to test 
  //yield delay(500);

  if (response.ok) {
    const data = response.data;
    yield put({ type: FETCH_CHATS_SUCCESS, data });
  } else {
    const error = response.error;
    yield put({ type: FETCH_CHATS_FAILURE, error });      
  }
}