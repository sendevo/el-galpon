import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import { GlobalProvider } from './GlobalContext';
import Home from './screens/index';
import StorageList from './screens/StorageList/index';
import StorageEdit from './screens/StorageEdit/index';
import CategoryList from './screens/CategoryList/index';
import CategoryView from './screens/CategoryView/index';
import HelpScreen from './screens/Help';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
          <Stack.Screen name="StorageList" component={StorageList} options={{headerShown: false}} />
          <Stack.Screen name="StorageEdit" component={StorageEdit} options={{headerShown: false}} />
          <Stack.Screen name="CategoryList" component={CategoryList} options={{headerShown: false}} />
          <Stack.Screen name="CategoryView" component={CategoryView} options={{headerShown: false}} />
          <Stack.Screen name="Help" component={HelpScreen} options={{headerShown: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
}
