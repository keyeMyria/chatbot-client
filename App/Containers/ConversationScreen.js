import React, { Component } from 'react'
import { View, Text, ListView, Platform } from 'react-native'
import { connect } from 'react-redux'

import {DoppioChat, Actions, Bubble} from '../Components/DoppioChat/Chat';
import CustomActions from '../Components/CustomActions';
import CustomView from '../Components/CustomView';

//import actions 

// Styles
import styles from './Styles/ConversationScreenStyle'

class ConversationScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.user.name.first} ${navigation.state.params.user.name.last}`,
    //headerTintColor: 'blue'
  });

  constructor (props) {
    super(props);

    const {cid, groupchat, user} = this.props.navigation.state.params;
    const me = require('../Fixtures/user.json');

    const self = {
      id: me.id,
      name: `${me.name.first} ${me.name.last}`,
      avatar: me.picture.thumbnail || {},
    };
    
    const contact = {
      id: user.id,
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.thumbnail || {},
    };

    this.state = {
      conversationid: cid,
      group: groupchat,
      user: self || {},
      contact: contact || {},
      messages: [],
      loadEarlier: true,
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
    this._loadMessage();
  }

  _loadMessage() {
    let user = this.state.user;
    let contact = this.state.contact;

    let cmessages = require('../Fixtures/messages.js');
    let myMessages = this._convertMessage(cmessages);
    console.log("--->message="+JSON.stringify(myMessages));

    this.setState(() => {
      return {
        messages: myMessages,
      };
    });
  }

  _convertMessage(messages) {
    let user = this.state.user;
    let contact = this.state.contact;
    /*
    return messages.map(function(a) {
      if (!a.isUser) {
        a['user']= contact;
      } else {
        a['user']= user;        
      }
      return a;
    });
    */
    return messages.map((a) => {
      /*
      if (!a.isUser) {
        a['user']= contact;
      } else {
        a['user']= user;        
      }
      return a;
      */
      return {...a,
              user: a.isUser? contact:user
      };
    });
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
    
    this.setState((previousState) => {
      return {
        messages: DoppioChat.append(previousState.messages, messages),
      };
    });

    // for demo purpose
    this.answerDemo(messages);
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

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConversationScreen)
