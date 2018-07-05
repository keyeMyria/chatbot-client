import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';

import MessageButton from './MessageButton';

export default class MessageButtons extends React.Component {
  constructor(props) {
    super(props);
    console.log('-XXX->MessageButtons, props=', this.props);
  }

  render() {
    const { buttons } = this.props;
    console.log('-XXX->, buttons=', buttons);
    if (buttons) {
      return (
        <View style={[styles.container, this.props.containerStyle]}>
        {
          buttons.map((button, i) => {
            return (
              <MessageButton
                button={button}
                key={i}
                onSend={this.props.onSend} />);
          })
        }
        </View>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
});

MessageButtons.defaultProps = {
  buttons: {},
  containerStyle: {},
  buttonStyle: {},
};

MessageButtons.propTypes = {
  buttons: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  containerStyle: ViewPropTypes.style,
  buttonStyle: ViewPropTypes.style
};