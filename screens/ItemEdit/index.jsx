import React from 'react';
import { SafeAreaView,
    ScrollView,
    TextInput, 
    Text, 
    TouchableOpacity } from 'react-native';
import styles from './style';
import globalStyles from '../style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';

export default class ProductEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null,
        product: {},
        code: "",
        expiration: 0,
        used: 100,
        price: 0,
        notes: ""
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Detalles del ítem</Text>
                    
                    <Text style={styles.section}>Nombre: {this.state.product?.name}</Text>                    

                    <Text style={styles.section}>Notas:</Text>
                    <TextInput
                        value={this.state.notes}
                        style={styles.textArea}
                        maxLength={100}
                        multiline = {true}
                        numberOfLines = {4}
                        onChangeText={t=>this.setState({notes:t})}/>
                    
                    <Text style={styles.section}>Price:</Text>
                    <TextInput
                        value={this.state.price.toString()}
                        keyboardType='numeric'
                        placeholder={"Precio"}
                        maxLength={10}
                        onChangeText={t=>this.setState({price:t})}/>
                </ScrollView>

                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{
                        this.props.navigation.navigate('ItemList',{productId: this.state.id})
                    }}>
                        <Ionicons name="save" size={32} color="white" />
                </TouchableOpacity>

            </SafeAreaView>
        );
    }
}