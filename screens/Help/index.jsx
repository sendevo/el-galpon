import React from 'react';
import { TouchableOpacity, ScrollView, ImageBackground, Text, View } from 'react-native';
import styles from './style';
import background from '../../assets/background/galpon1.png';

const HelpMenu = () => (
    <View style={styles.container}>
        <ImageBackground source={background} style={styles.background}>                
        <ScrollView style={styles.scrollview}>
            <TouchableOpacity style={styles.buttons} onPress={()=>{}}>
                <Text style={styles.buttonText}>Manual de usuario</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={()=>{}}>
                <Text style={styles.buttonText}>Info y novedades</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttons} onPress={()=>{}}>
                <Text style={styles.buttonText}>Acerca de</Text>
            </TouchableOpacity>
        </ScrollView>
        </ImageBackground>
    </View>
);

export default HelpMenu; 

