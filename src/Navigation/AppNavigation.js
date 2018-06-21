import { StackNavigator } from 'react-navigation';
/*import {
  createStackNavigator,
} from 'react-navigation';*/
import ConversationScreen from '../Containers/ConversationScreen';
import UserProfileScreen from '../Containers/UserProfileScreen';


import RegisterScreen from '../Containers/RegisterScreen';
import LaunchScreen from '../Containers/LaunchScreen';
import ChatScreen from '../Containers/ChatScreen';
import LoginScreen from '../Containers/LoginScreen';

import styles from './Styles/NavigationStyles';


// Manifest of possible screens
const PrimaryNav = StackNavigator({
  ChatScreen: { 
    screen: ChatScreen,
  },
  UserProfileScreen: {
    screen: UserProfileScreen,
  },
  RegisterScreen: { screen: RegisterScreen },
  LaunchScreen: { screen: LaunchScreen },
  Login: { screen: LoginScreen },
}, {
  headerMode: 'screen', //ios header
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav;
