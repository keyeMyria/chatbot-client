import React, { Component } from 'react';
import { AsyncStorage, ScrollView, Text, Image, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { initLogin, login } from '../Redux/LoginRedux';
import { onOpenChannelPress } from '../Redux/ChannelRedux';
import { sbConnect } from '../sendbirdActions';
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      user: null
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('-LaunchScreen:componentWillReceiveProps->, nextProps=', nextProps);
    const { user, channel } = nextProps;
    if (user) {
      //redirect to chat
      console.log('-User Login->, user=', user);
      this.setState({
        user: {
          id: user.userId,
          name: user.nickname,
          avatar: user.profileUrl
        }
      });
    }
    if (channel.channel) {
      console.log('-Channel entered->, channel=', channel);
      const sbChannnel = channel.channel;
      this.props.navigation.navigate('ChatScreen', {
        user: this.state.user,
        channelUrl: sbChannnel.url,
        coverUrl: sbChannnel.coverUrl,
        title: sbChannnel.name,
        memberCount: sbChannnel.participantCount,
        isOpenChannel: sbChannnel.isOpenChannel(),
        _initListState: this._initEnterState
      });
    }
  }

  componentDidMount() {
    console.log("-XXX->LaunchScreen!");
    AsyncStorage.getItem("user", (err, result) => {
      if(result) {
        this.setState({ isLoading: true }, () => {
          const user = JSON.parse(result);
          console.log('-App got saved user', user);
          sbConnect(user.userId, user.nickname)
            .then((user) => {
              console.log('-App-> Logged in exsting user, user=', user);
              this.setState({
                user: {
                  id: user.userId,
                  name: user.nickname,
                  avatar: user.profileUrl
                }
              });
              this.setState({ isLoading: false }, () => {
                AsyncStorage.getItem("payload", (err, result) => {
                  if(result) {
                    const notif = JSON.parse(result);
                    const isOpenChannel = () => {
                      return notif.channelType !== "group_messaging" && notif.channelType !== "messaging";
                    };
                    const channelType = isOpenChannel() ? "OpenChannel" : "GroupChannel";
                    console.log("-XXX->navigate to Chat!, result=". result);
                    this.props.navigation.dispatch(NavigationActions.reset({
                              index : 2,
                              actions : [
                              NavigationActions.navigate({ routeName : "Menu" }),
                              NavigationActions.navigate({ routeName : channelType }),
                              NavigationActions.navigate({ routeName : "Chat", params : {
                                          channelUrl: notif.channel.channel_url,
                                          title: notif.channel.name,
                                          isOpenChannel : isOpenChannel(),
                                          isFromPayload : true
                                        }
                                })
                              ]
                    }));
                  }
                  else {
                    console.log("-XXX->Open hard coded channel!", result);
                    //this.redirectTo("Menu");
                    this.props.openChannel({
                      channelUrl: 'sendbird_open_channel_38907_01f036874e67cba49e2dbe66db3bfe4f4cc2be6f'
                    })
                  }
                });
              });
            })
            .catch((err) => {
              this.setState({ isLoading: false }, () => {
                this.redirectTo("Login");
              });
            });
          });
      }
      else {
        console.log("-XXX->start automatically login");
        //this.redirectTo("Login");
        this.props.doLogin({userId: 'Ngtren', nickname: 'LinQX'});
      }
    });
  }

  _initEnterState = () => {
    this.setState({ enterChannel: false });
  }

  redirectTo(page, params) {
    this.props.navigation.dispatch(NavigationActions.reset({
      index : 0,
      actions : [
          NavigationActions.navigate({ routeName : page, params : params })
      ]
    }));
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.ngtiLogo} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <ActivityIndicator animating={true} color='blue' size='large' hidesWhenStopped={true} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  channel: state.channel
});

const mapDispatchToProps = (dispatch) => ({
  doLogin: (params) => {
    console.log('-doLogin: params=', params)
    const { userId, nickName } = params;
    dispatch(initLogin());
    dispatch(login(params));
  },
  openChannel: (params) => {
    const { channelUrl } = params;
    console.log('-openChannel: params=', params);
    dispatch(onOpenChannelPress(channelUrl));
  },
  saveUser: (user) => {
    dispatch({
      type: LOGIN_SUCCESS, 
      payload: user 
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)

