import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center'
  },
  background: {
    flex: 1,
    alignItems: 'center',
    resizeMode: 'contain',
    justifyContent: "center",
    opacity:0.8
  },  
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'stretch',
  },
  title: {
    color:'white',
    marginBottom:50, 
    marginTop:20,
    fontSize:25, 
    fontWeight:'bold'
  },
  buttons: {
    backgroundColor: 'rgb(250,250,250)',
    borderRadius: 5,
    padding: 15,
    marginTop: 5,
    width: 300,
    alignItems: 'center'
  }
});  

export default styles;