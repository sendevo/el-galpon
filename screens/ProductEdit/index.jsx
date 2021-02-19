import React from 'react';
import { SafeAreaView,
    ScrollView,
    TextInput, 
    Text, 
    Picker,
    TouchableOpacity,
    ToastAndroid } from 'react-native';
import styles from './style';
import globalStyles from '../style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import categories from '../../database/categories';
import units from '../../database/units';

export default class ProductEdit extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null,
        name: "",
        description: "",
        cat_id: null,
        subcat_id: null,
        quantity: 0,
        unit_id: null,
        toxicity: "",
        price: 0,
        itemList: []
    }

    componentDidMount() {
        const prod = this.props?.route?.params?.product;
        if(prod != undefined){ 
            // TODO: descargar lista de items que pertenecen a este producto
            // y hacer join con storage para obtener sus ubicaciones
            this.setState(prod);
        }
    }

    saveProduct() { // Actualizar datos en DB

        // TODO: Controlar todos los campos
        if(this.state.name == "" || this.state.name == undefined){
            ToastAndroid.showWithGravity(
                'Debe ingresar un nombre para este producto',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            return;
        }

        const newProduct = (({name, description, cat_id, subcat_id, quantity, unit_id, toxicity, price}) => (
            {name, description, cat_id, subcat_id, quantity, unit_id, toxicity, price}))(this.state);

        const navigate = this.props.navigation.navigate; // Para usar dentro de 'then'

        console.log(newProduct);

        if(this.state.id){ // Si se tiene id -> actualizar en db
            this.context.db.update("products", this.state.id, newProduct)
            .then(res => {
                console.log("Registro modificado."); // TODO: reemplazar por toast
                navigate('ProductList',{});
            })
            .catch(e => {
                console.log("Error actualizando registro"); // TODO: reemplazar por toast
                console.log(e);
            });
        }else{ // Si no tiene id -> crear nueva entrada            
            this.context.db.insert("products", newProduct)
            .then(res => {
                console.log("Nuevo registro creado."); // TODO: reemplazar por toast
                navigate('ProductList');
            })
            .catch(e => {
                console.log("Error creando registro"); // TODO: reemplazar por toast
                console.log(e);
            });
        }
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Detalles de producto</Text>
                    
                    <Text style={styles.section}>Nombre:</Text>
                    <TextInput
                        value={this.state.name}
                        style={styles.textInput}
                        placeholder={"Ingrese nombre"}
                        maxLength={20}
                        onChangeText={t=>this.setState({name:t})}/>

                    <Text style={styles.section}>Descripción:</Text>
                    <TextInput
                        value={this.state.description}
                        style={styles.textArea}
                        placeholder={"Detalles del producto"}
                        maxLength={100}
                        multiline = {true}
                        numberOfLines = {4}
                        onChangeText={t=>this.setState({description:t})}/>
                    
                    <Text style={styles.section}>Categoría:</Text>
                    <Picker
                        selectedValue={this.state.cat_id}
                        style={styles.categoryPicker}
                        onValueChange={(catValue, catIndex) => this.setState({ cat_id: catValue })}>
                        <Picker.Item label={"Seleccione..."} value={0} key={0} />
                        {categories.map((el)=>(
                            <Picker.Item label={el.name} value={el.id} key={el.id} />
                        ))}
                    </Picker>


                    <Text style={styles.section}>Presentación:</Text>
                    <TextInput
                        value={this.state.quantity.toString()}
                        style={styles.textInput}
                        keyboardType='numeric'
                        placeholder={"Cantidad"}
                        maxLength={10}
                        onChangeText={t=>this.setState({quantity:t})}/>
                    
                    <Text style={styles.section}>Unidad:</Text>
                    <Picker
                        selectedValue={this.state.unit_id}
                        style={styles.categoryPicker}
                        onValueChange={(unitValue, unitIndex) => this.setState({ unit_id: unitValue })}>
                        <Picker.Item label={"Seleccione..."} value={0} key={0} />
                        {units.map((el)=>(
                            <Picker.Item label={el.long} value={el.id} key={el.id} />
                        ))}
                    </Picker>

                    <Text style={styles.section}>Precio de referencia:</Text>
                    <TextInput
                        value={this.state.price.toString()}
                        style={styles.textInput}
                        keyboardType='numeric'
                        placeholder={"Valor"}
                        maxLength={10}
                        onChangeText={t=>this.setState({price:t})}/>

                    
                    <Text style={styles.section}>Disponibles en inventario:</Text>

                    <TouchableOpacity 
                        style={globalStyles.floatingButton}
                        onPress={()=>{this.saveProduct();}}>
                            <Ionicons name="save" size={32} color="white" />
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }
}