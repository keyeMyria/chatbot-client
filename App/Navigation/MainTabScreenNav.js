import { TabNavigator } from 'react-navigation';
//import Icon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-elements";
import Ionicons from 'react-native-vector-icons/Ionicons';

import PublicGroupsScreen from '../Containers/PublicGroupsScreen';
import RecentCallsScreen from '../Containers/RecentCallsScreen';
import ConversationsScreen from '../Containers/ConversationsScreen';

const MainTabScreenNav = TabNavigator({
    ConversationsScreen: {
        screen: ConversationsScreen,
        /*
        navigationOptions: {
            tabBar: {
                label: "Conversations",
                icon: ({ tintColor}) => <Icon name="list" size={35} color={tintColor} />
            }
        }*/
        navigationOptions: navigation => ({
            title: "Conversations",
            tabBarLabel: "Conversations",
            //tabBarIcon: ({ tintColor}) => <Icon name="list" size={35} color={tintColor} />
            //tabBarIcon: tintColor => <Icon name="search" size={15} color="#FF5E3A"/>
            /*tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                  name={focused ? 'ios-chatboxes' : 'ios-chatboxes-outline'}
                  size={26}
                  style={{ color: tintColor }}
                />
              ),*/
        })
    },
    RecentCallsScreen: {
        screen: RecentCallsScreen,
        navigationOptions: navigation => ({
            title: "RecentCalls",
            tabBarLabel: "RecentCalls",
            //tabBarIcon: ({ tintColor}) => <Icon name="call" size={35} color={tintColor} />            
        })
    },    
    PublicGroupsScreen: {
        screen: PublicGroupsScreen,
        navigationOptions: navigation => ({
            title: "PublicGroups",
            tabBarLabel: "PublicGroups",
            //tabBarIcon: ({ tintColor}) => <Icon name="list" size={35} color={tintColor} />   
        })      
    },    
  }, {
    initialRouteName: 'ConversationsScreen',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#e91e63',
      showIcon: true,
      showTitle: true,
      iconStyle: {width: 20, height: 20,backgroundColor: "green"}
    },
  });

  export default MainTabScreenNav;
  