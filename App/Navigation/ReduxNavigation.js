import React from 'react';
import * as ReactNavigation from 'react-navigation';
import { connect } from 'react-redux';
import AppNavigation from './AppNavigation';

// here is our redux-aware our smart component
function ReduxNavigation (props) {
  const { dispatch, nav } = props
  const navigation = ReactNavigation.addNavigationHelpers({
    dispatch,
    state: nav
  })

  return <AppNavigation navigation={navigation} {...this.props} />
}

const mapStateToProps = state => ({ nav: state.nav });
export default connect(mapStateToProps)(ReduxNavigation)

/*
import { connect } from 'react-redux';
import {
  createNavigationPropConstructor,       // handles #1 above
  //createNavigationReducer,               // handles #2 above
  createReactNavigationReduxMiddleware,  // handles #4 above
  initializeListeners,                   // handles #4 above
} from 'react-navigation-redux-helpers';

import AppNavigator from './AppNavigation';

export function createReduxNavMiddleware() {
  // Note: createReactNavigationReduxMiddleware must be run before createReduxBoundAddListener
  return createReactNavigationReduxMiddleware(
      'root',
      state => state.nav,
  );
}

const navigationPropConstructor = createNavigationPropConstructor("root");

class ReduxNavigation extends React.Component {
  componentDidMount() {
    initializeListeners("root", this.props.nav);
  }

  render() {
    this._navigation = navigationPropConstructor(
      this.props.dispatch,
      this.props.nav,
      AppNavigator.router,
      () => this._navigation
    );
    return <AppNavigator navigation={this._navigation} />;
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(ReduxNavigation);
*/
