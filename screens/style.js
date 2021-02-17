import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
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
    marginTop: 100,
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
    width: 250,
    alignItems: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18
  },
  screenTitle: {
    margin:30,
    fontSize:25, 
    fontWeight:'bold',
    alignSelf:'flex-start'
  },
  floatingButton:{
    width: 60,  
    height: 60,   
    borderRadius: 30,            
    backgroundColor: 'blue',                                    
    position: 'absolute',                                          
    bottom: 10,                                                    
    right: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});  

export default globalStyles;