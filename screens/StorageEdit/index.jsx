import React from 'react';
import { SafeAreaView, 
    StyleSheet, 
    Keyboard, 
    TextInput, 
    Text, 
    Dimensions, 
    TouchableOpacity,
    ToastAndroid, 
    View} from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './style';
import globalStyles from '../style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';

const mapStyle = StyleSheet.create({
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/2,
    }
});

const bsasCoords = {
    lat: -34.6037232,
    long: -58.3815931
};

export default class StorageEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null, // ID del deposito (si es nuevo, queda null)
        name: "", // Nombre no debe ser vacio para guardar
        lat: bsasCoords.lat, // Valor defecto
        long: bsasCoords.long, // Valor defecto
        itemList: [] // Lista de items que estan en este deposito (se descargan aca)
    }

    componentDidMount() {
        const st = this.props?.route?.params?.storage;
        if(st != undefined){ // Caso edicion de deposito existente
            // TODO: descargar lista de items que estan en este deposito
            this.setState(st);
        }else{ // Caso creacion nuevo deposito -> usar ubicacion actual
            try{
                Location.requestPermissionsAsync()
                .then(res => {
                    if(res.granted){
                        Location.getLastKnownPositionAsync({})
                        .then(location => {
                            if(location)
                                this.setState({ // Al ser operacion asincrona, hay que actualizar
                                    lat: location?.coords?.latitude,
                                    long: location?.coords?.longitude
                                });
                        })
                        .catch(loc_err => {
                            console.log(loc_err);
                            alert('No se pudo obtener la ubicación actual.');        
                        })
                    }
                })
                .catch(perm_err => {
                    console.log(perm_err);
                    alert('No ha otorgado permisos de ubicación a esta aplicación.');
                });
            }catch(e){
                console.log(e);
                alert('En este momento la aplicación no puede acceder a su ubicación actual.');
            }
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
        const newStorage = (({name, lat, long}) => ({name, lat, long}))(this.state);
        if(this.state.id){ // Si se tiene id -> actualizar en db
            this.context.db.update("storage", this.state.id, newStorage)
            .then(res => {
                console.log("Registro modificado."); // TODO: reemplazar por toast
                navigate('StorageList',{});
            })
            .catch(e => {
                console.log("Error actualizando registro"); // TODO: reemplazar por toast
            });
        }else{ // Si no tiene id -> crear nueva entrada            
            this.context.db.insert("storage", newStorage)
            .then(res => {
                console.log("Nuevo registro creado."); // TODO: reemplazar por toast
                navigate('StorageList');
            })
            .catch(e => {
                console.log("Error creando registro"); // TODO: reemplazar por toast
            });
        }
    }

    render() {
        const region = {
            latitude: this.state.lat,
            longitude: this.state.long,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
        };

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
                    region={region}
                    initialRegion={region}>
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
                    onPress={()=>{this.saveStorage();}}>
                        <Ionicons name="save" size={32} color="white" />
                    </TouchableOpacity>
            </SafeAreaView>
        );
    }
};
