import Immutable from 'seamless-immutable';
import { createReducer } from 'reduxsauce';


/* ------------- Action Constants ------------- */
export const FETCH_CHATS = 'FETCH_CHATS';
export const FETCH_CHATS_SUCCESS = 'FETCH_CHATS_SUCCESS';
export const FETCH_CHATS_FAILURE = 'FETCH_CHATS_FAILURE';


/* ------------- Actions ------------- */
export const getConversations = (userId) => ({
  type: FETCH_CHATS,
  payload: userId
});

export const conversationsFetched = (data) => ({
  type: FETCH_CHATS_SUCCESS,
  data
});

export const conversationsFailed = (error) => ({
  type: FETCH_CHATS_FAILURE,
  error: error
});

/* ------------- Initial State ------------- */
const INITIAL_STATE = Immutable({
  fetching: false,
  fetched: false,
  conversations: [],
  error: null
});


/* ------------- Reducers ------------- */
const handleFetchChats = (state, action) => {
  return state.merge({fetching: true});
};

const handleChatsFetched = (state, action) => {
  return state.merge({fetching: false, fetched: true, conversations: action.data});
};


const handleChatsFetchFailure = (state, action) => {
  return state.merge({fetching: false, fetched: false, error: true});  
};

// map our action types to our reducer function
export const HANDLERS = {
  FETCH_CHATS: handleFetchChats,
  FETCH_CHATS_SUCCESS: handleChatsFetched,
  FETCH_CHATS_FAILURE: handleChatsFetchFailure
}  

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, HANDLERS);