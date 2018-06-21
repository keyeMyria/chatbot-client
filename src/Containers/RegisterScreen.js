import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, Button, Image, KeyboardAvoidingView
} from 'react-native';
//import { View, InputGroup, Input } from 'native-base'
import {RoundedButton} from '../Components/RoundedButton.js';
import { connect } from 'react-redux';

import { Images } from '../Themes';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/RegisterScreenStyle'



class RegisterScreen extends Component {
  constructor() {
    super();

    this.state = {
      userId: "",
      errors: "",
    }
  }

  onRegisterPressed() {
    if (this.state.userId) {
      console.log("HAVE ACCESS TO THIS PROPS: "+this.state.userId);
    } else {
      let userIdEmptyErr = "User ID input cann't be empty!"; 
      this.setState({errors : userIdEmptyErr});
    }
    //alert("onRegisterPressed");
  }

  onTextChange(val) {
    this.setState({userId: val});
    if (val) {
      this.setState({errors : ""});
    }
  }

  render () {
    return (
      <View style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.doppioLogo} style={styles.logo} />
          </View>
          <KeyboardAvoidingView behavior="padding">
          <View style={styles.inputWrapper}>
				    <Text style={styles.label}>Doppio user ID:</Text>
				    <TextInput style={styles.input}
					            placeholder="Enter your user ID here"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={(val)=>this.onTextChange(val)}
				    />
            <Errors errors={this.state.errors} />
          </View>
          <Button 
              title='Register'
              onPress={()=>this.onRegisterPressed()}
          />
          </KeyboardAvoidingView>
      </View>
    )
  }
}

const Errors = (props) => {
  return (
    <View>
     <Text style={styles.error}>{props.errors}</Text>
    </View>
  )
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
