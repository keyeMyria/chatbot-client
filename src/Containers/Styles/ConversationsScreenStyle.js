import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,

  listContainer: {
    marginTop: 0, 
    borderTopWidth: 0, 
    borderBottomWidth: 0
  },
  badge: {
    marginTop: 0,
    backgroundColor: 'red'
  },
  listItem: {
    borderBottomWidth: 0
  }
});
