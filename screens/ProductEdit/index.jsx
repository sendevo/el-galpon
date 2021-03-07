import React from 'react';
import { SafeAreaView,
    ScrollView,
    TextInput, 
    Text, 
    Picker,
    TouchableOpacity,
    ToastAndroid, 
    View } from 'react-native';
import styles from './style';
import globalStyles from '../style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import { ItemCard } from '../../components/Cards/index';
import units from '../../database/units';

export default class ProductEdit extends React.Component {

    static contextType = GlobalContext

    state = { // En el constructor se vuelve a definir
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

    constructor(props) {
        super(props);
        this.updateList = this.updateList.bind(this);
        const prod = this.props?.route?.params?.product;
        if(prod){
            this.state = (({id, name, description, cat_id, subcat_id, quantity, unit_id, toxicity, price}) => (
                {id, name, description, cat_id, subcat_id, quantity, unit_id, toxicity, price}))(prod);
        }
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    updateList() {
        // Descargar items de este producto
        if(this.state.id){ // Si el producto ya existe en la db
            const statement = 'SELECT * FROM items WHERE product_id = ?';
            this.context.db.execute(statement, [this.state.id])
            .then(({rows:{_array}}) => {
                this.setState({itemList: _array});
            })
            .catch(e => console.log(e));        
        }
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

    insertItem() { // Agregar items de este producto al inventario
        
        const insert = () => { // Operacion final
            // Debe existir un deposito por defecto
            const storage_id = this.context.db.config?.default_storage;
            if(storage_id)
                this.context.db.insert('items',{
                    product_id: this.state.id,
                    storage_id: storage_id
                }).then(res => {
                    console.log("Insertar");
                    this.updateList();
                })
                .catch(e => console.log(e));
            else{
                ToastAndroid.showWithGravity(
                    'Debe seleccionar un depósito por defecto',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                );
            }
        };

        if(!this.state.id) // Si el producto no fue guardado, es necesario generar un id
            this.saveProduct()
            .then(res=>{
                this.state.id = res.insertId;
                insert();
            })
            .catch(e=>{
                console.log(e);
            });
        else
            insert();
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={globalStyles.screenTitle}>Inventario</Text>
                    {
                    this.state.itemList?.length > 0 ?
                        <View>
                            <Text>Cantidad de items: {this.state.itemList.length}</Text>
                            {
                                this.state.itemList.map( item => (
                                    <ItemCard 
                                        item={item} 
                                        key={item.id}
                                        onPress={()=>this.props.navigation.navigate('ItemEdit', {item_id: item.id})}
                                        onLongPress={()=>{
                                            this.context.db.deleteById('items', item.id);
                                            this.updateList();
                                        }}/>
                                ))
                            }
                        </View>
                    :
                        <Text>No hay ítems de este producto en el inventario.</Text>
                    }
                    <View style={styles.insertButtonContainer}>
                        <TouchableOpacity 
                            style={styles.insertButton}
                            onPress={()=>{this.insertItem();}}>
                            <Ionicons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

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