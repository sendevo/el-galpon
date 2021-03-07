import { StyleSheet } from 'react-native';

// CategoryView
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    margin:10
  },
  title:{
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 25
  },  
  subtitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 10
  },  
  description:{
    fontSize: 16,
    padding: 10
  },
  listitem:{
    fontSize: 12
  }
});  

export default styles;