import React, { Component }  from 'react';
import { SafeAreaView, StyleSheet, Keyboard, TextInput, Text, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import styles from '../../style/storageEdit';
import globalStyles from '../../style/globals';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';

const mapStyle = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
    }
});

export default class StorageEdit extends Component {

    static contextType = GlobalContext

    state = {
        id: null,
        name: "Sin nombre",
        lat: 0,
        long: 0
    }

    componentDidMount(){
        const st = this.props?.route?.params?.storage;
        if(st != undefined){ // Caso edicion de deposito existente
            // TODO: consultar lista de productos almacenados en deposito actual
            this.setState({
                id: st?.id,
                name: st?.name,
                lat: st?.long,
                long: st?.lat
            });
        }else{ // Caso creacion nuevo deposito -> usar ubicacion actual
            (async () => {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    // TODO: mostrar toast
                    console.log('Permiso a ubicacion denegado');         
                }else{
                    let location = await Location.getCurrentPositionAsync({});
                    this.setState({
                        lat: location?.coords?.latitude,
                        long: location?.coords?.longitude
                    });
                } 
            })();
        }
    }

    saveStorage(){
        // TODO: actualizar datos en db
        if(this.state.id){
            console.log("Actualizando deposito");
        }else{
            console.log("Creando nuevo deposito");
        }
        console.log(this.state);
    }

    render (){
        return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Detalles de depósito</Text>
            <Text style={styles.section}>Nombre:</Text>
            <TextInput
                value={this.state.name}
                style={styles.textInput}
                placeholder={"Ingrese nombre"}
                maxLength={20}
                onChangeText={t=>this.setState({name:t || "Sin nombre"})}
                onBlur={Keyboard.dismiss}
                />
            <Text style={styles.section}>Ubicación:</Text>
            <MapView
                style={mapStyle.map}
                region={{
                    latitude: this.state.lat || -38,
                    longitude: this.state.long || -62,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}
                initialRegion={{
                    latitude: this.state.lat || -38,
                    longitude: this.state.long || -62,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}>
                    <MapView.Marker   
                        draggable                     
                        title = {this.state.name}
                        coordinate={{ 
                            latitude : this.state.lat || -38 , 
                            longitude : this.state.long || -62 
                        }}
                        onDragEnd={e => this.setState({
                            lat: e.nativeEvent.coordinate.latitude,
                            long: e.nativeEvent.coordinate.longitude
                        })} />
            </MapView>
            <Text style={styles.section}>Contenido:</Text>

            <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{this.saveStorage();}}
                >
                    <Ionicons name="save" size={32} color="white" />
                </TouchableOpacity>
        </SafeAreaView>
        );
    }
};
