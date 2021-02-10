import React from 'react';
import { SafeAreaView, 
    StyleSheet, 
    Keyboard, 
    TextInput, 
    Text, 
    Dimensions, 
    TouchableOpacity,
    ToastAndroid } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './storageEdit';
import globalStyles from '../globals';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';

const mapStyle = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
    }
});

export default class StorageEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null,
        name: "",
        lat: 0,
        long: 0
    }

    constructor(props) {
        super(props);

        const st = props?.route?.params?.storage;
        if(st != undefined){ // Caso edicion de deposito existente
            this.state = {
                id: st?.id,
                name: st?.name,
                lat: st?.lat,
                long: st?.long
            };
        }else{ // Caso creacion nuevo deposito -> usar ubicacion actual
            (async () => {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permiso a ubicacion denegado');         
                }else{
                    let location = await Location.getLastKnownPositionAsync({});
                    this.setState({ // Al ser operacion asincrona, hay que actualizar
                        lat: location?.coords?.latitude,
                        long: location?.coords?.longitude
                    });
                } 
            })();
        }
    }

    saveStorage() { // Actualizar datos en DB
        if(this.state.name == "" || this.state.name == undefined){
            ToastAndroid.showWithGravity(
                'Debe ingresar un nombre para este depósito',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            return;
        }
        
        const navigate = this.props.navigation.navigate; // Para usar dentro de 'then'
        if(this.state.id){ // Si se tiene id -> actualizar en db
            this.context.db.update("storage", this.state.id, {
                name: this.state.name,
                lat: this.state.lat,
                long: this.state.long
            })
            .then(function(res){
                console.log("Registro modificado."); // TODO: reemplazar por toast
                navigate('StorageList',{});
            })
            .catch(function(e){
                console.log("Error actualizando registro"); // TODO: reemplazar por toast
            });
        }else{ // Si no tiene id -> crear nueva entrada            
            let newStorage = (({name, lat, long}) => ({name, lat, long}))(this.state);
            this.context.db.insert("storage",newStorage)
            .then(function(res){
                console.log("Nuevo registro creado."); // TODO: reemplazar por toast
                navigate('StorageList',{});
            })
            .catch(function(e){
                console.log("Error creando registro"); // TODO: reemplazar por toast
            });
        }
    }

    render() {
        return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Detalles de depósito</Text>
            <Text style={styles.section}>Nombre:</Text>
            <TextInput
                value={this.state.name}
                style={styles.textInput}
                placeholder={"Ingrese nombre"}
                maxLength={20}
                onChangeText={t=>this.setState({name:t})}
                onBlur={Keyboard.dismiss}
                />
            <Text style={styles.section}>Ubicación:</Text>
            <MapView
                style={mapStyle.map}
                initialRegion={{
                    latitude: this.state.lat,
                    longitude: this.state.long,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                }}>
                    <MapView.Marker   
                        draggable                     
                        title = {this.state.name}
                        coordinate={{ 
                            latitude : this.state.lat, 
                            longitude : this.state.long 
                        }}
                        onDragEnd={e => {
                            this.state.lat = e.nativeEvent.coordinate.latitude;
                            this.state.long = e.nativeEvent.coordinate.longitude;
                        }} />
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
