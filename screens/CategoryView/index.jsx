import React from 'react';
import { SafeAreaView, 
    Keyboard, 
    TextInput, 
    Text, 
    TouchableOpacity } from 'react-native';
import styles from './style';
import globalStyles from '../style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';


export default class CategoryEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null, // ID de la categoria (si es nueva, queda null)
        name: "", // Nombre no debe ser vacio para guardar
        desc: "", // Descripcion de la categoria
        itemList: [] // Lista de items de esta categoria
    }

    constructor(props) {
        super(props);
        const cat = this.props?.route?.params?.category;
        this.state = cat;
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
