import React, { Component }  from 'react';
import { StyleSheet, Keyboard, TextInput, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
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
        storage: null
    }

    componentDidMount(){
        this.setState({storage: this.props?.route?.params?.storage});
    }

    render (){
        return (
        <View style={styles.container}>
            <TextInput
                style={styles.textInput}
                placeholder={this.state.storage?.name || "Ingrese nombre"}
                maxLength={20}
                onBlur={Keyboard.dismiss}
                />
            <MapView
                style={mapStyle.map}
                initialRegion={{
                    latitude: this.state.storage?.lat || -38,
                    longitude: this.state.storage?.long || -62,
                    latitudeDelta: 0.2,
                    longitudeDelta: 0.2,
                    }
                }>
                    <MapView.Marker                        
                        title = {this.state.storage?.name}
                        coordinate={{ 
                            latitude : this.state.storage?.lat || -38 , 
                            longitude : this.state.storage?.long || -62 
                        }} />
            </MapView>
            <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{
                        console.log("Guardar storage!");
                    }}
                >
                    <Ionicons name="save" size={32} color="white" />
                </TouchableOpacity>
        </View>
        );
    }
};

/*
{
    this.state.storage ?
    <View>
        <Text>Nombre: {this.state.storage?.name}</Text>
        <Text>Lat: {this.state.storage?.lat}</Text>
        <Text>Long: {this.state.storage?.long}</Text>
    </View>
    :
    <Text>Cargar datos</Text>
}
*/