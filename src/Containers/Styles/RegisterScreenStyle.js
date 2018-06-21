import { StyleSheet } from 'react-native'
import { Metrics, ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    logo: {
      marginTop: Metrics.doubleSection,
      height: Metrics.images.logo,
      width: Metrics.images.logo,
      resizeMode: 'contain'
    },
    centered: {
      alignItems: 'center'
    },
    inputWrapper:{
      marginLeft:Metrics.baseMargin,
      marginRight:Metrics.baseMargin,
      marginTop:Metrics.baseMargin,
      marginBottom: 0,
      opacity:0.9,
    },
    label:{
      fontSize:14,
      fontStyle: "italic",
      marginBottom: Metrics.baseMargin
    },
    input:{
      height: 40,
      fontSize:14,
      backgroundColor:"#fff",
      opacity:0.9,
      borderRadius:7
    },
    error: {
      fontSize:12,
      fontStyle: "italic",
      color:"red",
      textAlign: "center",
      marginTop:Metrics.baseMargin,
    }
})
