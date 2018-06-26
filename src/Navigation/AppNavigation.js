import { StackNavigator } from 'react-navigation';
/*import {
  createStackNavigator,
} from 'react-navigation';*/
import UserProfileScreen from '../Containers/UserProfileScreen';
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
