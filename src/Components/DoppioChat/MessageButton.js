import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import { Button } from 'react-native-elements';

export default class MessageButton extends React.Component {
  onPress = () => {
    const { button, onSend } = this.props;
    if (onSend) {
      onSend([{text: button.text}]);
    }
  }

  render() {
    const { button } = this.props;
    if (button) {
      return <Button
                title={button.text}
                backgroundColor='#177FE3'
                borderRadius={8}
                onPress={this.onPress}
                style={[styles.buttonStyle, this.props.buttonStyle]}
                />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    //backgroundColor: '#FFFFFF'
  }
});

MessageButton.defaultProps = {
  button: {},
  buttonStyle: {},
  onSend: () => {}
};

MessageButton.propTypes = {
  button: PropTypes.object,
  buttonStyle: ViewPropTypes.style,
  onSend: PropTypes.func
};