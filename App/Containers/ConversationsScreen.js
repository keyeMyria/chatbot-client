import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { List, ListItem, SearchBar } from "react-native-elements";
import { connect } from 'react-redux';

import ReduxPersist from '../Config/ReduxPersist'
import {getConversations} from '../Redux/ChatsRedux'

// Styles
import styles from './Styles/ConversationsScreenStyle'

class ConversationsScreen extends Component {

  constructor (props) {
    super(props);

    const me = require('../Fixtures/user.json');    

    this.state = {
      userId: me.id || {},
      refreshing: false
    };
  }

  _onItemPressed = (cid, groupchat, user) => {
    console.log("-XXX->_onItemPressed, id: " + cid + ", groupchat="+groupchat+", user=" + JSON.stringify(user));
    this.props.navigation.navigate('ConversationScreen', {cid, groupchat, user});
  }

  _onItemLongPressed = (user) => {
    console.log("-XXX->_onItemLongPressed, user=" + JSON.stringify(user));
    this.props.navigation.navigate('UserProfileScreen', user);    
  }

  componentWillMount() {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.getData(this.state.userId);
    }
  }

  /*
  componentDidMount() {
    this._loadConversations();
  }

  _loadConversations() {
    //get data from fixture
    let cdata = require("../Fixtures/conversations.json");
    //console.log("--->Prepare Conversations! data="+JSON.stringify(cdata));
    
    this.setState({
      data: cdata.conversations,
      error: null,
      loading: false,
      refreshing: false
    });
  }
  */

  _loadMoreConversations = () => {
    console.log("--->Load more conversations!");
  }

  _onRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.loadMoreConversations();
      }
    );
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  _renderHeader = () => {
    return null;
    //return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  _renderFooter = () => {
    if (!this.props.chats.fetching) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  render() {
    return (
      /*
      <ScrollView>
        <List containerStyle={{ marginTop: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
          {this.state.data.map((conversation) => (
            <ListItem
              key={conversation.id}
              onPress={()=>this._onItemPressed(conversation)}
              roundAvatar
              hideChevron
              badge={{ value: conversation.unreadmsg, containerStyle: { marginTop: 0, backgroundColor: 'red' } }}
              title={`${conversation.name.first} ${conversation.name.last}`}
              subtitle={conversation.message}
              avatar={{ uri: conversation.avatar }}
              containerStyle={{ borderBottomWidth: 0 }}
            />
          ))}
        </List>
      </ScrollView>
      */
      <List containerStyle={styles.listContainer}>
        <FlatList
          //data={this.state.data}
          data={this.props.chats.conversations}
          renderItem={({item }) => item.unreadmsg>0 ? (
            <ListItem
              onPress={()=>this._onItemPressed(item.id, item.groupchat, item.user)}
              onLongPress={()=>this._onItemLongPressed(item.user)}
              roundAvatar={true}
              hideChevron={true}
              badge={{ value: item.unreadmsg, containerStyle: styles.badge  }}
              title={`${item.user.name.first} ${item.user.name.last}`}
              subtitle={item.message}
              avatar={{ uri: item.user.picture.thumbnail }}
              containerStyle={styles.listItem}
            />
          ) : (
            <ListItem
              onPress={()=>this._onItemPressed(item.id, item.groupchat, item.user)}
              onLongPress={()=>this._onItemLongPressed(item.user)}
              roundAvatar={true}
              hideChevron={true}
              title={`${item.user.name.first} ${item.user.name.last}`}
              subtitle={item.message}
              avatar={{ uri: item.user.picture.thumbnail }}
              containerStyle={styles.listItem}
            />
          )}
          keyExtractor={(item, index) => item.id}
          ItemSeparatorComponent={this._renderSeparator}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          onRefresh={this._onRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this._loadMoreConversations}
          onEndReachedThreshold={50}
        />
      </List>
    );
  }
}

const mapStateToProps = (state) => ({
  chats: state.chats
});

const mapDispatchToProps = (dispatch) => ({
    getData: (userId) => dispatch(getConversations(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ConversationsScreen)
