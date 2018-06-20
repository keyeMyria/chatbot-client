import React, { Component } from 'react'
import { View, Text, ListView, Platform, BackHandler } from 'react-native'
import { connect } from 'react-redux'

import { DoppioChat, Actions, Bubble, Avatar } from '../Components/DoppioChat/Chat';
import CustomActions from '../Components/CustomActions';
import CustomView from '../Components/CustomView';

//import actions
import {
  initChatScreen,
  getChannelTitle,
  createChatHandler,
  onSendButtonPress,
  getPrevMessageList,
  //onUserBlockPress,
  onFileButtonPress,
  typingStart,
  typingEnd,
  channelExit
} from '../Redux/ChatRedux';

import {
  sbGetGroupChannel,
  sbGetOpenChannel,
  sbCreatePreviousMessageListQuery,
  sbAdjustMessageList,
  sbIsImageMessage,
  sbMarkAsRead
} from "../sendbirdActions";


// Styles
import styles from './Styles/ConversationScreenStyle'

class ChatScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
    //headerTintColor: 'blue'
  });

  constructor (props) {
    super(props);
    console.log("-Chat->, navParams=", this.props.navigation.state.params);
    const { user, channelUrl, title, isOpenChannel, coverUrl, isFromPayload } = this.props.navigation.state.params;

    const me = require('../Fixtures/user.json');

    const self = {
      id: me.id,
      name: `${me.name.first} ${me.name.last}`,
      avatar: me.picture.thumbnail || {},
    };
    
    const contact = {
      id: channelUrl,
      name: `${title}`,
      avatar: coverUrl || {},
    };

    this.state = {
      channel: null,
      channelUrl,
      isOpenChannel,
      isFromPayload,
      user: user || {},
      contact: contact || {},
      messages: [],
      previousMessageListQuery: null,
      isLoading: false,
      loadEarlier: false,
      typingText: null,
      isLoadingEarlier: false,
    };

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    //this._loadMessage();
  }

  componentDidMount() {
    this.props.initChat();
    this.props.navigation.setParams({ handleHeaderLeft: this._onBackButtonPress });

    const channelUrl = this.state.channelUrl;
    const isOpenChannel = this.state.isOpenChannel;
    console.log("=>XXX->setup channel, ", channelUrl, ", ", isOpenChannel);
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl).then(channel => this.setState({ channel }, () => this._componentInit()));
    } else {
      sbGetGroupChannel(channelUrl).then(channel => this.setState({ channel }, () => this._componentInit()));
    }

    BackHandler.addEventListener('hardwareBackPress', this._onBackButtonPress);
    if (this.state.isFromPayload) {
      AsyncStorage.removeItem("payload", () => {});
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._onBackButtonPress);
  }

  componentWillReceiveProps(nextProps) {
    const { chat } = nextProps;
    //console.log('-Chat:componentWillReceiveProps->, newChat=', chat);
    const oldChat = this.props.chat;
    //console.log('-Chat:componentWillReceiveProps->, oldChat=', oldChat);

    if (chat && chat.list && chat.list.length > 0 && chat.list.length !== oldChat.list.length) {
      //console.log('-Receive chat list->', chat.list);
      const list = sbAdjustMessageList(chat.list);
      console.log('-coverted chat list->',list);
      const newMessages = list.map(msg => ({
        id: msg.messageId,
        text: msg.message,
        createdAt: new Date(msg.createdAt),
        isUser: this._isUser(msg._sender),
        received: true,
        sent: true,
        //user: msg.isUser? this.state.user : this.state.contact
        user: this._convertSender(msg._sender)
      }));

      console.log("*** Messages=", newMessages);
      this.setState((prevState) => {
        return {
          messages: newMessages
          //messages: DoppioChat.append(prevState.messages, newMessages),
        };
      });
    }
  }

  _componentInit = () => {
    console.log("*** _componentInit *** ");
    const channelUrl = this.state.channelUrl;
    const isOpenChannel = this.state.isOpenChannel;
    this.props.getChannelTitle(channelUrl, isOpenChannel);
    this.props.createChatHandler(channelUrl, isOpenChannel);
    this._getMessageList(true);
    if (!isOpenChannel) {
      sbMarkAsRead({ channelUrl });
    }
  };

  _onBackButtonPress = () => {
    if (this.state.channel) {
      this.props.channelExit(this.state.channelUrl, this.state.isOpenChannel);
    };
    return true;
  };

  _getMessageList = init => {
    console.log('-_getMessageList->');
    if (!this.state.previousMessageListQuery && !init) {
      return;
    }
    const channelUrl = this.state.channelUrl;
    const isOpenChannel = this.state.isOpenChannel;
    this.setState({ isLoading: true }, () => {
      if (init) {
        sbCreatePreviousMessageListQuery(channelUrl, isOpenChannel)
          .then(previousMessageListQuery => {
            this.setState({ previousMessageListQuery }, () => {
              this.props.getPrevMessageList(this.state.previousMessageListQuery);
            });
          })
          .catch(error => this.props.navigation.goBack());
      } else {
        this.props.getPrevMessageList(this.state.previousMessageListQuery);
      }
    });
  };

  _loadMessage() {
    let user = this.state.user;
    let contact = this.state.contact;

    let cmessages = require('../Fixtures/messages.js');
    let myMessages = this._convertMessage(cmessages);
    console.log("--->Loaded message=", myMessages);

    this.setState(() => {
      return {
        messages: myMessages,
      };
    });
  }

  _convertMessage(messages) {
    let user = this.state.user;
    let contact = this.state.contact;

    return messages.map((a) => {
      return {...a,
        user: a.isUser? contact:user
      };
    });
  }

  _isUser = sender => {
    if (sender && sender.userId === this.state.user.id) {
      return true;
    }
    return false;
  }

  _convertSender = sender => {
    return {
      id: sender.userId,
      name: sender.nickname,
      avatar: sender.profileUrl
    }
  }

  onLoadEarlier() {
    console.log("===> Chat root container cb: onLoadEarlier");
    
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        let oldMessages = require('../Fixtures/old_messages.js');
        
        this.setState((previousState) => {
          return {
            messages: DoppioChat.prepend(previousState.messages, this._convertMessage(oldMessages)),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    console.log("===> Chat root container cb: onSend, msg="+JSON.stringify(messages));
    /*
    this.setState((previousState) => {
      return {
        messages: DoppioChat.append(previousState.messages, messages),
      };
    });

    // for demo purpose
    this.answerDemo(messages);
    */
    const textMessage = messages[0].text;
    this.props.sendMessage(this.state.channelUrl, this.state.isOpenChannel, textMessage);
  }

  onPressAvatar(user) {
    console.log("===> Chat root container cb: onPressAvatar, user="+JSON.stringify(user));
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          console.log("-XXX->Set typing");
          return {
            typingText: `${this.state.contact.name} is typing ...`
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        //Clean composing footer
        this.setState((previousState) => {
          console.log("-XXX->Clean typing");
          return {
            typingText: null,
          };
        });

        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('Alright');
            } else {
              this._isAlright = false;
              this.onReceive('Cool!');
            }
          }
        }
      }
    }, 1000);
  }

  onReceive(text) {
    console.log('OnReceive!')
    this.setState((previousState) => {
      return {
        messages: DoppioChat.append(previousState.messages, {
          id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: this.state.contact,
        }),
      };
    });
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    /*
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
    );
    */
   return null;
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: styles.bubble
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    console.log("**** renderFooter ***, typing: " + this.state.typingText);
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <DoppioChat
        user={this.state.user}
        messages={this.state.messages}
        onSend={this.onSend}
        onPressAvatar={this.onPressAvatar}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  chat: state.chat
});

const mapDispatchToProps = (dispatch) => ({
  initChat: () => {
    dispatch(initChatScreen());
  },
  getChannelTitle: (channelUrl, isOpenChannel) => {
    dispatch(getChannelTitle(channelUrl, isOpenChannel));
  },
  createChatHandler: (channelUrl, isOpenChannel) => {
    dispatch(createChatHandler(channelUrl, isOpenChannel));
  },
  getPrevMessageList: (previousMessageListQuery) => {
    console.log('*** Fetch messgae list ***')
    dispatch(getPrevMessageList(previousMessageListQuery));
  },
  sendMessage: (channelUrl, isOpenChannel, message) => {
    console.log('*** send msg=', message);
    dispatch(onSendButtonPress(channelUrl, isOpenChannel, message));
  },
  channelExit: (channelUrl, isOpenChannel) => {
    dispatch(channelExit(channelUrl, isOpenChannel));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
