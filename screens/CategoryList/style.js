import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center'
  },  
  flatlist:{
    paddingBottom: 200
  },
  categoryCard: {
    backgroundColor: 'rgb(220,220,220)',
    borderRadius: 10,
    padding: 20,
    margin:5
  },
  categoryName: {
      fontWeight: 'bold',
      fontSize: 20
  }
});  

export default styles;