import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { GlobalProvider } from './GlobalContext';
import Home from './components/Home';
import StorageList from './components/Storage/StorageList';
import StorageEdit from './components/Storage/StorageEdit';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="StorageList" component={StorageList} options={{headerShown: false}} />
          <Stack.Screen name="StorageEdit" component={StorageEdit} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}
