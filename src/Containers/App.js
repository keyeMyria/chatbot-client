import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
  AppState,
} from "react-native";
import SendBird from 'sendbird';

import RootContainer from './RootContainer';
import createStore from '../Redux';

// create our store
const store = createStore();

class App extends Component {
  componentDidMount() {
    console.log("*** App start ***");
    console.disableYellowBox = true;
    AppState.addEventListener("change", this._handleAppStateChange);
  }
  componentWillUnmount() {
    console.log('app is killed');
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log("-XXX->App sttate change, nextAppState=", nextAppState)
    const sb = SendBird.getInstance();
    if (sb) {
      if (nextAppState === 'active') {
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
