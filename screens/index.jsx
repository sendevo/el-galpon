import React from 'react';
import { Image, ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import styles from './style';
import background from '../assets/background/galpon1.png';
import logo from '../assets/logo.png';

export default class Home extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={background} style={styles.background}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>El Galpón</Text>
          <TouchableOpacity style={styles.buttons} onPress={()=>{this.props.navigation.navigate('StorageList')}}>
            <Text>Depósitos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{this.props.navigation.navigate('CategoryList')}}>
            <Text>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{this.props.navigation.navigate('ProductList')}}>
            <Text>Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{/*this.props.navigation.navigate('ItemList')*/}}>
            <Text>Inventario</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{/*this.props.navigation.navigate('Operations')*/}}>
            <Text>Movimientos</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
};