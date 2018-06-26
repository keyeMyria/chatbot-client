import { 
  sbGetOpenChannel, 
  sbOpenChannelEnter, 
  sbGetChannelTitle,
  sbGetMessageList, 
  sbSendTextMessage,
  sbSendFileMessage,
  sbUserBlock ,
  sbGetGroupChannel,
  sbOpenChannelExit,
  sbTypingStart,
  sbTypingEnd,
  sbIsTyping,
  sbMarkAsRead
} from '../sendbirdActions';

import SendBird from 'sendbird';

//action constants
export const INIT_CHAT_SCREEN = 'init_chat_screen';
export const CREATE_CHAT_HANDLER_SUCCESS = 'create_chat_handler_success';
export const CREATE_CHAT_HANDLER_FAIL = 'create_chat_handler_fail';
export const CHANNEL_TITLE_CHANGED = 'channel_title_changed';
export const CHANNEL_TITLE_CHANGED_FAIL = 'channel_title_changed_fail';
export const MESSAGE_LIST_SUCCESS = 'message_list_success';
export const MESSAGE_LIST_FAIL = 'message_list_fail';
export const SEND_MESSAGE_TEMPORARY = 'send_message_temporary';
export const SEND_MESSAGE_SUCCESS = 'send_message_success';
export const SEND_MESSAGE_FAIL = 'send_message_fail';

export const SEND_TYPING_START_SUCCESS = 'send_typing_start_success';
export const SEND_TYPING_START_FAIL = 'send_typing_start_fail';
export const SEND_TYPING_END_SUCCESS = 'send_typing_end_success';
export const SEND_TYPING_END_FAIL = 'send_typing_end_fail';

export const CHANNEL_EXIT_SUCCESS = 'channel_exit_success';
export const CHANNEL_EXIT_FAIL = 'channel_exit_fail';

export const MESSAGE_RECEIVED = 'message_received';
export const MESSAGE_UPDATED = 'message_updated';
export const MESSAGE_DELETED = 'message_deleted';
export const CHANNEL_CHANGED = 'channel_changed';
export const TYPING_STATUS_UPDATED = 'typing_status_updated';
export const READ_RECEIPT_UPDATED = 'read_receipt_updated';

//actions
export const initChatScreen = () => {
  const sb = SendBird.getInstance();
  sb.removeAllChannelHandlers();
  return { type: INIT_CHAT_SCREEN }
}

export const getChannelTitle = (channelUrl, isOpenChannel) => {
  return (dispatch) => {
      if (isOpenChannel) {
          sbGetOpenChannel(channelUrl)
          .then((channel) => {
              dispatch({
                  type: CHANNEL_TITLE_CHANGED,
                  title: sbGetChannelTitle(channel),
                  memberCount: channel.participantCount
              });
          })
          .catch((error) => { dispatch({ type: CHANNEL_TITLE_CHANGED_FAIL }) });
      } else {
          sbGetGroupChannel(channelUrl)
          .then((channel) => {
              dispatch({
                  type: CHANNEL_TITLE_CHANGED,
                  title: sbGetChannelTitle(channel),
                  memberCount: channel.memberCount
              })
          })
          .catch((error) => {
              dispatch({ type: CHANNEL_TITLE_CHANGED_FAIL })
          }
          )
      }
  }
}

export const createChatHandler = (channelUrl, isOpenChannel) => {
  return (dispatch) => {
      if (isOpenChannel) {
          sbGetOpenChannel(channelUrl) 
          .then((channel) => {
              sbOpenChannelEnter(channel)
              .then((channel) => { 
                  registerOpenChannelHandler(channelUrl, dispatch); 
                  dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
              })
              .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
          })
          .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
      } else {
          sbGetGroupChannel(channelUrl)
          .then((channel) => {
              registerGroupChannelHandler(channelUrl, dispatch);
              dispatch({ type: CREATE_CHAT_HANDLER_SUCCESS });
          })
          .catch( (error) => dispatch({ type: CREATE_CHAT_HANDLER_FAIL }) );
      }
  }
}

const registerCommonHandler = (channelHandler, channelUrl, dispatch) => {
  channelHandler.onMessageReceived = (channel, message) => {
      if (channel.url === channelUrl) {
          if (channel.isGroupChannel()) {
              sbMarkAsRead({ channel });
          }
          dispatch({
              type: MESSAGE_RECEIVED,
              payload: message
          })
      }
  }
  channelHandler.onMessageUpdated = (channel, message) => {
      if (channel.url === channelUrl) {
          dispatch({
              type: MESSAGE_UPDATED,
              payload: message
          })
      }
  }
  channelHandler.onMessageDeleted = (channel, messageId) => {
      if (channel.url === channelUrl) {
          dispatch({
              type: MESSAGE_DELETED,
              payload: messageId
          })
      }
  }
}

const registerOpenChannelHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  
  registerCommonHandler(channelHandler, channelUrl, dispatch);

  channelHandler.onUserEntered = (channel, user) => {
      if (channel.url === channelUrl) {
          dispatch({
              type: CHANNEL_CHANGED,
              memberCount: channel.participantCount,
              title: channel.name
          })
      }
  }
  channelHandler.onUserExited = (channel, user) => {
      if (channel.url === channelUrl) {
          dispatch({
              type: CHANNEL_CHANGED,
              memberCount: channel.participantCount,
              title: channel.name
          })
      }
  }

  sb.addChannelHandler(channelUrl, channelHandler);
}

const registerGroupChannelHandler = (channelUrl, dispatch) => {
  const sb = SendBird.getInstance();
  let channelHandler = new sb.ChannelHandler();
  
  registerCommonHandler(channelHandler, channelUrl, dispatch);

  channelHandler.onUserJoined = (channel, user) => {
      if (channel.url === channelUrl) {
          dispatch({
              type: CHANNEL_TITLE_CHANGED,
              title: sbGetChannelTitle(channel),
              memberCount: channel.memberCount
          });
      }
  }
  channelHandler.onUserLeft = (channel, user) => {
      if (channel.url === channelUrl) {
          dispatch({
              type: CHANNEL_TITLE_CHANGED,
              title: sbGetChannelTitle(channel),
              memberCount: channel.memberCount
          });
      }
  }
  channelHandler.onReadReceiptUpdated =  (channel) => { 
      if (channel.url === channelUrl) {
          dispatch({ type: READ_RECEIPT_UPDATED })
      }
  };
  channelHandler.onTypingStatusUpdated =  (channel) => { 
      if (channel.url === channelUrl) {
          const typing = sbIsTyping(channel);
          dispatch({ 
              type: TYPING_STATUS_UPDATED,
              typing: typing
          });
      }
  }; 

  sb.addChannelHandler(channelUrl, channelHandler);
}

export const getPrevMessageList = (previousMessageListQuery) => {
  return (dispatch) => {
      if (previousMessageListQuery.hasMore) {
          sbGetMessageList(previousMessageListQuery)
          .then((messages) => {
              dispatch({
                  type: MESSAGE_LIST_SUCCESS,
                  list: messages
              });
          })
          .catch( (error) => dispatch({ type: MESSAGE_LIST_FAIL }) )
      } else {
          dispatch({ type: MESSAGE_LIST_FAIL });
      }
  }
}

export const onSendButtonPress = (channelUrl, isOpenChannel, textMessage) => {
  return (dispatch) => {
      if (isOpenChannel) {
          sbGetOpenChannel(channelUrl)
          .then((channel) => {
              sendTextMessage(dispatch, channel, textMessage);
          })
          .catch( (error) => dispatch({ type: SEND_MESSAGE_FAIL }) )
      } else {
          sbGetGroupChannel(channelUrl)
          .then((channel) => {
              sendTextMessage(dispatch, channel, textMessage);
          })
          .catch( (error) => dispatch({ type: SEND_MESSAGE_FAIL }) )
      }
  }
}

const sendTextMessage = (dispatch, channel, textMessage) => {
  const messageTemp = sbSendTextMessage(channel, textMessage, (message, error) => {
      if (error) {
          dispatch({ type: SEND_MESSAGE_FAIL });
      } else {
          dispatch({ 
              type: SEND_MESSAGE_SUCCESS,
              message: message
          });
      }
  });
  dispatch({
      type: SEND_MESSAGE_TEMPORARY,
      message: messageTemp
  });
}

export const onUserBlockPress = (blockUserId) => {
  return (dispatch) => {
      sbUserBlock(blockUserId)
      .then( (user) => dispatch({ type: USER_BLOCK_SUCCESS }) )
      .catch( (error) => dispatch({ type: USER_BLOCK_FAIL }) )
  }
}

export const onFileButtonPress = (channelUrl, isOpenChannel, source) => {
  return (dispatch) => {
      if (isOpenChannel) {
          sbGetOpenChannel(channelUrl)
          .then((channel) => {
              sendFileMessage(dispatch, channel, source);
          })
          .catch((error) => dispatch({ type: SEND_MESSAGE_FAIL }))
      } else {
          sbGetGroupChannel(channelUrl)
          .then((channel) => {
              sendFileMessage(dispatch, channel, source);
          })
          .catch( (error) => dispatch({ type: SEND_MESSAGE_FAIL }) )
      }
  }
}

const sendFileMessage = (dispatch, channel, file) => {
  const messageTemp = sbSendFileMessage(channel, file, (message, error) => {
      if (error) {
          dispatch({ type: SEND_MESSAGE_FAIL });
          return;
      } else {
          dispatch({ 
              type: SEND_MESSAGE_SUCCESS,
              message: message
          });
      }
  })
  dispatch({
      type: SEND_MESSAGE_TEMPORARY,
      message: messageTemp
  })
}

export const typingStart = (channelUrl) => {
  return (dispatch) => {
      sbTypingStart(channelUrl)
      .then( (response) => dispatch({ type: SEND_TYPING_START_SUCCESS }) )
      .catch( (error) => dispatch({ type: SEND_TYPING_START_FAIL }) )
  }
}

export const typingEnd = (channelUrl) => {
  return (dispatch) => {
      sbTypingEnd(channelUrl)
      .then( (response) => dispatch({ type: SEND_TYPING_END_SUCCESS }) )
      .catch( (error) => dispatch({ type: SEND_TYPING_END_FAIL }) )
  }
}

export const channelExit = (channelUrl, isOpenChannel) => {
  return (dispatch) => {
      if (isOpenChannel) {
          sbGetOpenChannel(channelUrl)
          .then((channel) => {
              sbOpenChannelExit(channel)
              .then((response) => dispatch({ type: CHANNEL_EXIT_SUCCESS }))
              .catch((error) => dispatch({ type: CHANNEL_EXIT_FAIL }))
          })
          .catch((error) => dispatch({ type: CHANNEL_EXIT_FAIL }))
      } else {
          const sb = SendBird.getInstance();
          sb.removeChannelHandler(channelUrl);
          dispatch({ type: CHANNEL_EXIT_SUCCESS });
      }
  }
}

// Reducer
const INITAL_STATE = {
  list: [],
  memberCount: 0,
  title: '',
  exit: false,
  typing: ''
}

// Handlers
const handleSendMessageSuccess = (state, action) => {
  const newMessage = action.message;
  const sendSuccessList = state.list.map((message) => {
    if (message.reqId && newMessage.reqId && message.reqId.toString() === newMessage.reqId.toString()) {
      return newMessage;
    } else {
      return message;
    }
  })
  return { ...state, list: sendSuccessList };
}

const handleSendMessageFail = (state, action) => {
  const newChatList = state.list.slice(1);
  return { ...state, list: newChatList };
} 

const handleMessageReceived = (state, action) => {
    const msgReceived = action.payload.message;
    const msgData = action.payload.data;
    console.log('-XXX->handleMessageReceived, msg=', msgReceived, ', msg_data=', msgData);
    let msgJson = null;
    if (msgData) {
      try {
        msgJson = JSON.parse(msgData);
      } catch (e) {
        console.log('-XXX->', e);
      }
    }
    let newPayload = action.payload;
    if (msgJson) {
      console.log('-ParsedJson->', msgJson);
      newPayload = {
        ...action.payload,
        data: msgJson
      }
      console.log('-XXX->Modified payload, ', newPayload);
    }
    console.log(msgReceived);
    return { ...state, list: [...[newPayload], ...state.list]}
}

const reducer = (state = INITAL_STATE, action) => {
  switch(action.type) {
    case INIT_CHAT_SCREEN: 
      return { ...state, ...INITAL_STATE };
    case CREATE_CHAT_HANDLER_SUCCESS:
      return { ...state }
    case CREATE_CHAT_HANDLER_FAIL:
      return { ...state }
    case CHANNEL_TITLE_CHANGED:
      return { ...state, title: action.title, memberCount: action.memberCount }
    case CHANNEL_TITLE_CHANGED_FAIL:
      return { ...state }
    case MESSAGE_LIST_SUCCESS:
      return { ...state, list: [...state.list, ...action.list] };
    case MESSAGE_LIST_FAIL:
      return { ...state };
    case SEND_MESSAGE_TEMPORARY:
      return { ...state, list: [...[action.message], ...state.list]}
    case SEND_MESSAGE_SUCCESS:
      return handleSendMessageSuccess(state, action);
    case SEND_MESSAGE_FAIL:
      return handleSendMessageFail(state, action);
    case CHANNEL_EXIT_SUCCESS:
      return { ...state, exit: true };
    case CHANNEL_EXIT_FAIL:
      return { ...state, exit: false };
    case MESSAGE_RECEIVED:
      return handleMessageReceived(state, action);
    case MESSAGE_UPDATED:
          const updatedMessage = action.payload;
          const updatedList = state.list.map((message) => {
              if (message.messageId === updatedMessage.messageId) {
                  message = updatedMessage
              }
              return message
          });
          return { ...state, list: updatedList }
      case MESSAGE_DELETED:
          const deletedList = state.list.filter((message) => {
              return message.messageId.toString() !== action.payload.toString();
          });
          return { ...state, list: deletedList }
      case CHANNEL_CHANGED:
          return { ...state, memberCount: action.memberCount, title: action.title }
      case TYPING_STATUS_UPDATED:
          return { ...state, typing: action.typing };
      case READ_RECEIPT_UPDATED:
          return { ...state, list: state.list };
      default:
          return state;
  }
}

export default reducer;



