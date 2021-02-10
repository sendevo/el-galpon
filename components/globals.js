import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
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