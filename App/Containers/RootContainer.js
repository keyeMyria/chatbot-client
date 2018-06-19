import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import ReduxNavigation from '../Navigation/ReduxNavigation'
import { connect } from 'react-redux'
//import StartupActions from '../Redux/StartupRedux'
import {startup} from '../Redux/StartupRedux'
import ReduxPersist from '../Config/ReduxPersist'

// Styles
import styles from './Styles/RootContainerStyles'

class RootContainer extends Component {

  constructor(props) {
    super(props);

    //TODO read user credential from local storage
    const me = require('../Fixtures/user.json');    
    this.state = {
      user: me || {}
    }

    console.log("-XXX-> RootContainer, me=", me);
  }

  componentWillMount () {
    // if redux persist is not active fire startup action
    if (!ReduxPersist.active) {
      this.props.startup();
    }
  }

  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <ReduxNavigation user={this.state.user}/>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
});

// wraps dispatch to create nicer functions to call within our component
const mapDispatchToProps = (dispatch) => ({
  startup: () => {
    //console.log("-Dispatch->:StartupActions.startup");
    //dispatch(StartupActions.startup());
    dispatch(startup());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer)
