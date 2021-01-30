import React, { Component }  from 'react';
import { Image, ImageBackground, TouchableOpacity, Text, View } from 'react-native';
import styles from '../style/home';
import background from '../assets/background/galpon1.png';
import logo from '../assets/logo.png';

export default class Home extends Component {
  render (){
    return (
      <View style={styles.container}>
        <ImageBackground source={background} style={styles.background}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.title}>El Galpón</Text>
          <TouchableOpacity style={styles.buttons} onPress={()=>{this.props.navigation.navigate('Storage')}}>
            <Text>Depósitos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{/*this.props.navigation.navigate('Categories')*/}}>
            <Text>Categorías</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{/*this.props.navigation.navigate('Products')*/}}>
            <Text>Productos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{/*this.props.navigation.navigate('Items')*/}}>
            <Text>Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons} onPress={()=>{/*this.props.navigation.navigate('Operations')*/}}>
            <Text>Movimientos</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
};