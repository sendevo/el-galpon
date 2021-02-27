import React from 'react';
import { Image, ScrollView, ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import styles from './style';
import background from '../assets/background/galpon1.png';
import logo from '../assets/logo.png';

const Home = (props) => (
  <View style={styles.container}>
    <ImageBackground source={background} style={styles.background}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>El Galpón</Text>
      <ScrollView>
        <TouchableOpacity style={styles.buttons} onPress={()=>{props.navigation.navigate('StorageList')}}>
          <Text style={styles.buttonText}>Depósitos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={()=>{props.navigation.navigate('CategoryList')}}>
          <Text style={styles.buttonText}>Categorías</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={()=>{props.navigation.navigate('ProductList')}}>
          <Text style={styles.buttonText}>Productos</Text>
        </TouchableOpacity>        
        <TouchableOpacity style={styles.buttons} onPress={()=>{/*props.navigation.navigate('Operations')*/}}>
          <Text style={styles.buttonText}>Movimientos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttons, {marginTop:15}]} onPress={()=>{props.navigation.navigate('Help')}}>
          <Text style={styles.buttonText}>Información y ayuda</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  </View>
);

export default Home;