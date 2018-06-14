import { StackNavigator } from 'react-navigation';
/*import {
  createStackNavigator,
} from 'react-navigation';*/
import ConversationScreen from '../Containers/ConversationScreen';
import UserProfileScreen from '../Containers/UserProfileScreen';


import RegisterScreen from '../Containers/RegisterScreen';
import LaunchScreen from '../Containers/LaunchScreen';

import styles from './Styles/NavigationStyles';

import MainTabScreenNav from './MainTabScreenNav';

const ConversationStack = StackNavigator({
  ConversationScreen: { 
    screen: ConversationScreen,
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
  },
}, {
  // Default config for all screens
  mode : "modal",
  //headerMode: 'none',
  headerMode: 'screen', //ios header
  initialRouteName: 'ConversationScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
});

// Manifest of possible screens
const PrimaryNav = StackNavigator({
//const PrimaryNav = createStackNavigator({
  ConversationScreen: { 
    screen: ConversationScreen,
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
  },
  RegisterScreen: { screen: RegisterScreen },
  LaunchScreen: { screen: LaunchScreen },
  MainTabScreenNav: {screen: MainTabScreenNav },
}, {
  // Default config for all screens
  //mode : "modal",
  //headerMode: 'none',
  headerMode: 'screen', //ios header
  initialRouteName: 'MainTabScreenNav',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
