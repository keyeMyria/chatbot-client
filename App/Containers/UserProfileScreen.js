import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { List, ListItem, Tile } from "react-native-elements";

import { connect } from 'react-redux';

class UserProfileScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "User Profile",
    headerTintColor: 'orange'
  });

  constructor (props) {
    super(props);

    const user = this.props.navigation.state.params;
    
    this.state = {
      user: user,
    };
    console.log("-XXX_>user: "+JSON.stringify(this.state.user));
  }
  
  render() {
    return (
      <ScrollView>
        {this.state.user && 
        <Tile 
          imageSrc={{uri: this.state.user.picture.large}}
          featured
          title={`${this.state.user.name.first.toUpperCase()} ${this.state.user.name.last.toUpperCase()}`}
          caption={this.state.user.id}
        />}
        <List>
          {this.state.user && 
          <ListItem
            title="Phone"
            rightTitle={this.state.user.phone}
            hideChevron
          />}
          {this.state.user && 
          <ListItem
            title="Mobile"
            rightTitle={this.state.user.cell}
            hideChevron
          />}
        </List>

      </ScrollView>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen)
  