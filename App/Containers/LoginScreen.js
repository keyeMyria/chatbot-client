import React, { Component } from 'react';
import { View, Text, TextInput, Image, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Button  from 'react-native-elements';
import { initLogin, login } from '../Redux/LoginRedux';
import {
    sbRegisterPushToken
  } from '../sendbirdActions';
import Spinner  from '../Components/Spinner.js';

// Styles
import styles from './Styles/LoginScreenStyle'

class LoginScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userId: '',
            nickname: ''
        }
    }

    componentDidMount() {
        this.props.initLogin();
    }

    componentWillReceiveProps(props) {
        let { user, error } = props;
        if (user) {
            AsyncStorage.getItem('pushToken', (err, pushToken) => {
                if(pushToken) {
                    sbRegisterPushToken(pushToken)
                        .then(res => {})
                        .catch(err => {});
                }
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Menu' })
                    ]
                });
                this.setState({ userId: '', nickname: '', isLoading: false }, () => {
                    this.props.navigation.dispatch(resetAction);
                });
            });
        }

        if (error) {
            this.setState({ isLoading: false });
        }
    }

    _onUserIdChanged = (userId) => {
        this.setState({ userId });
    }

    _onNicknameChanged = (nickname) => {
        this.setState({ nickname });
    }

    _onButtonPress = () => {
        const { userId, nickname } = this.state;
        this.setState({ isLoading: true }, () => {
            this.props.login({ userId, nickname });
        });
    }

    render() {
      return (
          <View style={styles.containerStyle}>
              <Spinner visible={this.state.isLoading} />
              <View style={styles.logoViewStyle}>
                  <Image 
                      style={{width: 150, height: 150}}
                      source={require('../img/icon_sb_512.png')}
                  />
                  <Text style={styles.logoTextTitle}>SendBird</Text>
                  <Text style={styles.logoTextSubTitle}>React Native</Text>
              </View>

              <View style={styles.inputViewStyle}>
                  <TextInput 
                      label='User ID'
                      placeholder='User ID'
                      style={styles.inputStyle}
                      value={this.state.userId}
                      duration={100}
                      autoCorrect={false}
                      maxLength={16}
                      underlineColorAndroid='transparent'
                      onChangeText={this._onUserIdChanged}
                  />
              </View>

              <View style={styles.inputViewStyle}>
                  <TextInput 
                      label='Nickname'
                      placeholder='Nickname'
                      style={styles.inputStyle}
                      value={this.state.nickname}
                      duration={100}
                      autoCorrect={false}
                      maxLength={16}
                      underlineColorAndroid='transparent'
                      onChangeText={this._onNicknameChanged}
                  />
              </View>

              <View style={styles.buttonStyle}>
                  <Button
                      title='CONNECT'
                      buttonStyle={{backgroundColor: '#6e5baa'}}
                      onPress={this._onButtonPress}
                      disabled={this.state.isLoading}
                  />
              </View>
              
              <Text style={styles.errorTextStyle}>{this.props.error}</Text>

              <View style={[styles.footerViewStyle]}>
                  <Text style={styles.footerTextStyle}>Sample UI v2.1.2 / SDK v.3.0.61</Text>
              </View>
          </View>
        );
    }
}

function mapStateToProps({ login }) {
    const { error, user } = login;
    return { error, user };
};

/*
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initLogin, login
  };
}*/

export default connect(mapStateToProps, { initLogin, login })(LoginScreen);
//export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);