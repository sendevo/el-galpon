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
        if(prod)
            this.setState(prod);
    }

    async saveProduct() { // Actualizar datos en DB
        // TODO: Controlar todos los campos
        if(this.state.name == "" || this.state.name == undefined){
            ToastAndroid.showWithGravity(
                'Debe ingresar un nombre para este producto',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
            return Promise.reject("Debe ingresar nombre de producto");
        }

        const newProduct = (({name, description, cat_id, subcat_id, quantity, unit_id, toxicity, price}) => (
            {name, description, cat_id, subcat_id, quantity, unit_id, toxicity, price}))(this.state);

        if(this.state.id) // Si se tiene id -> actualizar en db
            return this.context.db.update("products", this.state.id, newProduct);
        else // Si no tiene id -> crear nueva entrada            
            return this.context.db.insert("products", newProduct);
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
                        {
                            this.context.categories.map((el)=>(
                                <Picker.Item label={el.name} value={el.id} key={el.id} />
                            ))
                        }
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
                        {
                            units.map((el)=>(
                                <Picker.Item label={el.long} value={el.id} key={el.id} />
                            ))
                        }
                    </Picker>

                    <Text style={styles.section}>Precio de referencia:</Text>
                    <TextInput
                        value={this.state.price.toString()}
                        style={styles.textInput}
                        keyboardType='numeric'
                        placeholder={"Valor"}
                        maxLength={10}
                        onChangeText={t=>this.setState({price:t})}/>

                    
                    <TouchableOpacity
                        style={styles.inventoryButton}
                        onPress={()=>{
                            if(this.state.id) // Si es nuevo producto, primero se debe guardar para que tenga id
                                this.saveProduct()
                                .then(res=>{
                                    this.state.id = res.insertId;
                                    navigate('ItemList',{productId: res.insertId});
                                })
                                .catch(e=>{
                                    console.log(e);
                                });        
                            else // Si no es nuevo producto, navega directamente al listado con el id
                                this.props.navigation.navigate('ItemList',{productId: this.state.id})
                            }}>
                            <Text>Gestionar ítems</Text>
                    </TouchableOpacity>
                </ScrollView>

                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{
                        const navigate = this.props.navigation.navigate;
                        this.saveProduct()
                        .then(res=>{
                            navigate('ProductList');
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