import { sbGetOpenChannelList, sbGetOpenChannel, sbOpenChannelExit } from '../sendbirdActions';

export const INIT_OPEN_CHANNEL = 'init_open_channel';
export const OPEN_CHANNEL_PROGRESS_START = 'open_channel_progress_start';
export const OPEN_CHANNEL_PROGRESS_END = 'open_channel_progress_end';
export const OPEN_CHANNEL_LIST_SUCCESS = 'open_channel_list_success';
export const OPEN_CHANNEL_LIST_FAIL = 'open_channel_list_fail';

export const GET_OPEN_CHANNEL_SUCCESS = 'get_open_channel_success';
export const GET_OPEN_CHANNEL_FAIL = 'get_open_channel_fail';
export const ADD_OPEN_CHANNEL_ITEM = 'add_open_channel_item';
export const CLEAR_ADD_OPEN_CHANNEL = 'clear_add_open_channel';
export const CLEAR_SELETED_OPEN_CHANNEL = 'clear_selected_open_channel';

export const INIT_OPEN_CHANNEL_CREATE = 'init_open_channel_create';
export const OPEN_CHANNEL_CREATE_SUCCESS = 'open_channel_create_success';
export const OPEN_CHANNEL_CREATE_FAIL = 'open_channel_create_fail';

export const INIT_MENU = 'init_menu'
export const DISCONNECT_SUCCESS = 'disconnect_success';

export const initOpenChannel = () => {
  return { type: INIT_OPEN_CHANNEL };
}

export const getOpenChannelList = (openChannelListQuery) => {
  return (dispatch) => {
      if (openChannelListQuery.hasNext) {
          sbGetOpenChannelList(openChannelListQuery)
          .then((channels) => dispatch({
              type: OPEN_CHANNEL_LIST_SUCCESS,
              list: channels
          }))
          .catch((error) => dispatch({ type: OPEN_CHANNEL_LIST_FAIL }))
      } else {
          dispatch({ type: OPEN_CHANNEL_LIST_FAIL });
      }
  }
}

export const onOpenChannelPress = (channelUrl) => {
  return (dispatch) => {
      sbGetOpenChannel(channelUrl) 
      .then((channel) => {
          console.log('-GET_OPEN_CHANNEL_SUCCESS, channel=', channel);
          dispatch({ 
            type: GET_OPEN_CHANNEL_SUCCESS, 
            channel: channel
      })})
      .catch((error) => dispatch({ type: GET_OPEN_CHANNEL_FAIL }));
  }
}

export const addOpenChannelItem = (channel) => {
  return {
      type: ADD_OPEN_CHANNEL_ITEM,
      channel: channel
  };
}

export const clearCreatedOpenChannel = () => {
  return { type: CLEAR_ADD_OPEN_CHANNEL };
}

export const clearSeletedOpenChannel = () => {
  return { type: CLEAR_SELETED_OPEN_CHANNEL };
}

export const openChannelProgress = (start) => {
  return { type: start ? OPEN_CHANNEL_PROGRESS_START : OPEN_CHANNEL_PROGRESS_END };
}

const INITIAL_STATE = {
    isLoading: false,
    list: [],
    channel: null,
    createdChannel: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INIT_OPEN_CHANNEL: 
        return { ...state, ...INITAL_STATE };
    case OPEN_CHANNEL_PROGRESS_START:
        return { ...state, isLoading: true };
    case OPEN_CHANNEL_PROGRESS_END:
        return { ...state, isLoading: false };
    case OPEN_CHANNEL_LIST_SUCCESS: 
        return { 
            ...state, 
            isLoading: false,
            list: [...state.list, ...action.list]
        };
    case OPEN_CHANNEL_LIST_FAIL: 
        return { ...state, isLoading: false };
    case GET_OPEN_CHANNEL_SUCCESS:
        return { ...state, channel: action.channel };
    case GET_OPEN_CHANNEL_FAIL:
        return { ...state, channel: null };
    case ADD_OPEN_CHANNEL_ITEM:
        return { ...state, createdChannel: action.channel };
    case CLEAR_ADD_OPEN_CHANNEL:
        return { ...state, createdChannel: null };
    case CLEAR_SELETED_OPEN_CHANNEL: 
        return { ...state, channel: null};
    default:
        return state;
  }
};