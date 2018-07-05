import PropTypes from 'prop-types';
import React from 'react';
import {
  StyleSheet,
  ViewPropTypes,
  Text
} from 'react-native';
import {
  Card,
  Button
} from 'react-native-elements';

export default class MessageCard extends React.Component {
  render() {
    const { card } = this.props;
    if (card) {
      return (
        <Card title={card.header}>
          <Text style={styles.title}>
            {card.title}
          </Text>
          <Text style={styles.description}>
            {card.description}
          </Text>
          <Text style={styles.footer}>
            {card.footer}
          </Text>
          <Button
            backgroundColor='#177FE3'
            buttonStyle={{borderRadius: 8, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='View details' />
      </Card>);
    }
    return null;
  }
}

const styles = StyleSheet.create({
  cardStyle: {
    //backgroundColor: '#FFFFFF'
  },
  title: {
    textAlign: 'center',
    color: '#4d4d4d',
    marginBottom: 10
  },
  description: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 10
  },
  footer: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 18,
    marginTop: 10,
    marginBottom: 20
  }
});

MessageCard.defaultProps = {
  card: {},
  cardStyle: {}
};

MessageCard.propTypes = {
  card: PropTypes.object,
  cardStyle: ViewPropTypes.style
};