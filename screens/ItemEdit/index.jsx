import React from 'react';
import { SafeAreaView,
    ScrollView,
    TextInput, 
    Picker,
    Text, 
    TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { GlobalContext } from '../../GlobalContext';
import styles from './style';
import globalStyles from '../style';


export default class ProductEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        showPicker: false, // Mostrar modal del selector de fecha
        id: null,
        product_name: "", // Se obtiene con el join a products
        storageList: [], // Se obtiene con consulta a toda la tabla
        product_id: null, // Solo se usa para retornar a la vista anterior con id
        // Campos editables en este formulario:
        storage_id: null,
        code: "",
        expiration: 0,
        used: 100, // Porcentaje de uso del item
        price: 0,
        notes: ""
    }

    constructor(props) {
        super(props);
        this.state.id = this.props?.route?.params?.item_id;
    }

    componentDidMount() {
        // Descargar detalles de item y producto
        const statement = `
            SELECT 
                p.name AS product_name, 
                p.id AS product_id, 
                p.price AS product_price,
                i.* 
            FROM items i
            INNER JOIN products p ON (p.id = i.product_id)
            WHERE i.id = ?
        `;

        const that = this; // Para referenciar en el callback de la promesa
        
        this.context.db.execute(statement, [this.state.id])
        .then(({rows:{_array}}) => {
            const item_data = _array[0]; // No debe haber mas de un elemento en la consulta
            this.context.db.getTable('storage')
            .then(res=>{
                that.setState({
                    product_name: item_data.product_name, 
                    product_id: item_data.product_id,
                    storageList: res,
                    storage_id: item_data.storage_id,
                    code: item_data.code,
                    expiration: item_data.expiration,
                    used: item_data.used,
                    price: item_data.price,
                    notes: item_data.notes
                });
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));        
    }

    async saveItem() { // Actualizar datos en DB
        // TODO: Controlar todos los campos antes de guardar
        const newItem = (({storage_id, code, expiration, used, price, notes}) => (
                    {storage_id, code, expiration, used, price, notes}
                ))(this.state);
        return this.context.db.update("items", this.state.id, newItem);
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>{this.state.product_name}</Text>

                    <Text style={styles.section}>Depósito:</Text>
                    <Picker
                        selectedValue={this.state.storage_id}
                        style={styles.storagePicker}
                        onValueChange={(stValue, stIndex) => this.setState({ storage_id: stValue })}>
                        <Picker.Item label={"Seleccione..."} value={0} key={0} />
                        {
                            this.state.storageList.map((el)=>(
                                <Picker.Item label={el.name} value={el.id} key={el.id} />
                            ))
                        }
                    </Picker>

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
                        value={this.state.price?.toString()}
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
                        const navigate = this.props.navigation.goBack;
                        this.saveItem()
                        .then(res=>{
                            navigate();
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