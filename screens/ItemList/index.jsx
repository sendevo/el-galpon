import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../style';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import { ProductCard } from '../../components/Cards/index';


export default class ItemList extends React.Component {
    
    static contextType = GlobalContext

    state = {
        itemList: []
    }

    constructor(props) {
        super(props);
        this.updateList = this.updateList.bind(this);
    }

    updateList() {
        this.context.db.execute('SELECT * FROM items WHERE id = ?', [this.props.route.params.productId])
        .then(({rows:{_array}}) => {
            if(_array.length > 0)
                this.setState({itemList: _array});
        })
        .catch(e => console.log(e));        
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    insertItem() {
        this.context.db.insert('items',{
            product_id: this.props.route.params.productId
        }).then(res => {
            console.log("Insertar");
            this.updateList();
        })
        .catch(e => console.log(e));
    }

    render(){
        const renderCard = ({item}) => (
            <ProductCard 
                item={item} 
                onPress={()=>this.props.navigation.navigate('ItemEdit', {item: item})}
                onLongPress={()=>{
                    this.context.db.deleteById('items', item.id);
                    this.updateList();
                }}/>
        );

        return (
            <SafeAreaView style={styles.container}>                
                <Text style={globalStyles.screenTitle}>Inventario</Text>
                {
                    this.state.itemList.length == 0 ?
                    <Text>No hay ítems de este producto en el inventario.</Text>
                    :
                    <FlatList
                        contentContainerStyle={styles.flatlist}
                        data = {this.state.itemList}
                        extraData = {this.state.itemList}
                        keyExtractor = {el => el.id.toString()}
                        renderItem = {renderCard}/>
                    
                    
                }
                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{
                        this.insertItem();
                    }}>
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
};