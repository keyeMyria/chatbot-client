import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  containerStyle: {
      backgroundColor: '#fff', 
      flex: 1
  },
  logoViewStyle: {
      marginTop: 80,
      marginBottom: 20,
      alignItems: 'center'
  },
  logoTextTitle: {
      color: '#7d62d9', 
      fontSize: 30, 
      fontWeight: '600'
  },
  logoTextSubTitle: {
      color: '#7d62d9', 
      fontSize: 13, 
      fontWeight: '500'
  },
  inputViewStyle: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      paddingLeft: 8,
      paddingRight: 8,
      marginLeft: 28,
      marginRight: 28,
      marginTop: 8
  },
  inputStyle: {
      fontSize:13,
      backgroundColor:'#fff'
  },
  buttonStyle: {
      paddingLeft: 12, 
      paddingRight: 12, 
      marginTop: 50
  },
  errorTextStyle: {
      alignSelf: 'center', 
      fontSize: 12, 
      color: '#e03131'
  },
  footerViewStyle: {
      paddingLeft: 28,
      paddingRight: 28,
      marginTop: 15, 
      flexDirection: 'column'   
  },
  footerTextStyle: {
      alignSelf: 'center', 
      fontSize: 12, 
      color: '#8e8e8e'
  }
});
