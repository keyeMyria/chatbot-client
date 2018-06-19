import '../Config'
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import {
  Platform,
  AppState,
  AsyncStorage,
  PushNotificationIOS
} from "react-native";
/*
import FCM, {
  FCMEvent,
  NotificationType,
  NotificationActionType,
  RemoteNotificationResult,
  WillPresentNotificationResult
} from "react-native-fcm";
*/
import SendBird from 'sendbird';

import {
  sbRegisterPushToken
} from '../sendbirdActions';

import RootContainer from './RootContainer';
import createStore from '../Redux';

// create our store
const store = createStore();

/**
 * Provides an entry point into our application.  Both index.ios.js and index.android.js
 * call this component first.
 *
 * We create our Redux store here, put it into a provider and then bring in our
 * RootContainer.
 *
 * We separate like this to play nice with React Native's hot reloading.
 */
class App extends Component {
  componentDidMount() {
    console.log("*** App start ***");
    console.disableYellowBox = true;
    /*
    FCM.requestPermissions();
    FCM.on(FCMEvent.Notification, notif => {
      console.log('foreground notif', notif);
      if (Platform.OS === "ios") {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;

          case NotificationType.NotificationResponse:
            notif.finish();
            break;

          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
        }
        try {
          const sendbirdNotification = (typeof notif.sendbird === 'string') ? JSON.parse(notif.sendbird) : notif.sendbird;
          if (sendbirdNotification) {
            AsyncStorage.setItem('payload',
              JSON.stringify({
                "channelType": sendbirdNotification.channel_type,
                "channel": sendbirdNotification.channel
              }),
              () => { });
            showLocalNotificationWithAction(notif);
          }
        } catch (e) {
        }
      }
    });

    FCM.on(FCMEvent.RefreshToken, token => {
      AsyncStorage.setItem('pushToken', token);
      sb = SendBird.getInstance();
      AsyncStorage.getItem('user', (err, user) => {
        if (user) {
          this._registerPushToken(token);
        }
      });
    });

    if(Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
    */
    console.log('app is launched');
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  componentWillUnmount() {
    console.log('app is killed');
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _registerPushToken = (token) => {
    sbRegisterPushToken(token)
      .then(res => { })
      .catch(err => { });
  }
  
  _handleAppStateChange = (nextAppState) => {
    console.log("-XXX->App sttate change, nextAppState=", nextAppState)
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
        if(Platform.OS === 'ios') {
          PushNotificationIOS.setApplicationIconBadgeNumber(0);
        }
        console.log('app is into foreground');
        sb.setForegroundState();
      } else if (nextAppState === 'background') {
        console.log('app is into background');
        sb.setBackgroundState();
      }
    }
  }

  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

export default App;
