import React from 'react';
import { SafeAreaView,
    ScrollView,
    TextInput, 
    Text, 
    TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import styles from './style';
import globalStyles from '../style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';

export default class ProductEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null,
        product: {},
        storageId: null,
        code: "",
        expiration: 0,
        used: 100,
        price: 0,
        notes: "",
        showPicker: false
    }

    constructor(props) {
        super(props);
        this.state.product = this.props?.route?.params?.product;
    }

    async saveItem() { // Actualizar datos en DB
        // TODO: Controlar todos los campos
        const newItem = (({code, expiration, used, price, notes}) => ({code, expiration, used, price, notes}))(this.state);
        return this.context.db.update("items", this.state.id, newItem);
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>{this.state.product?.name}</Text>

                    <Text style={styles.section}>Código de producto:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={this.state.code}
                        placeholder={"Código"}
                        maxLength={15}
                        onChangeText={t=>this.setState({code:t})}/>

                    <Text style={styles.section}>Anotaciones:</Text>
                    <TextInput
                        style={styles.textArea}
                        value={this.state.notes}
                        placeholder={"Detalles"}
                        maxLength={100}
                        multiline = {true}
                        numberOfLines = {4}
                        onChangeText={t=>this.setState({notes:t})}/>
                    
                    <Text style={styles.section}>Precio:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={this.state.price.toString()}
                        keyboardType='numeric'
                        placeholder={"Precio"}
                        maxLength={10}
                        onChangeText={t=>this.setState({price:t})}/>

                    <Text 
                        style={styles.section}
                        onPress={() => this.setState({showPicker: true})}>
                            Fecha de vencimiento: 
                            {
                            this.state.expiration ?
                            moment(this.state.expiration).format("DD/MM/YYYY")
                            :
                            " (Indicar)"
                            }
                    </Text>
                    <DateTimePickerModal
                        isVisible={this.state.showPicker}
                        mode="date"
                        date={new Date()}
                        onConfirm={date=>{
                            this.setState({showPicker:false, expiration: moment(date).valueOf()});
                        }}
                        onCancel={()=>this.setState({showPicker: false})}/>
                </ScrollView>

                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{
                        const navigate = this.props.navigation.navigate;
                        this.saveItem()
                        .then(res=>{
                            navigate('ProductEdit',{productId: this.state.product.id});
                        })
                        .catch(e=>{
                            console.log(e);
                        });
                    }}>
                        <Ionicons name="save" size={32} color="white" />
                </TouchableOpacity>

            </SafeAreaView>
        );
    }
}