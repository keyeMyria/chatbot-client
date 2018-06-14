import React, { Component } from 'react'
import { ScrollView, Text, Image, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

class LaunchScreen extends Component {
  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.doppioLogo} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <ActivityIndicator animating={true} color='blue' size='large' hidesWhenStopped={true} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)

