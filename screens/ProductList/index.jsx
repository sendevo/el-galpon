import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../style';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import { ProductCard } from '../../components/Cards/index';
import groupBy from 'lodash/groupBy';

export default class ProductList extends React.Component {
    
    static contextType = GlobalContext

    state = {
        productCategories: []
    }

    constructor(props) {
        super(props);
        this.updateList = this.updateList.bind(this);
    }

    updateList() {
        this.context.db.getTable('products')
        .then(res => {
            // Agrupar productos por categoria
            const grouped = groupBy(res, "cat_id");
            let groupedArr = [];
            for(let c in grouped){ // Convertir a array
                groupedArr.push({ 
                    name: this.context.categories.find(el => el.id == c).name,
                    list: grouped[c]
                });
            }
            this.setState({productCategories: groupedArr});
        });
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    render(){
        const renderCard = ({item}) => (
            <ProductCard 
                item={item} 
                onPress={()=>this.props.navigation.navigate('ProductEdit', {product:item})}
                onLongPress={()=>{
                    this.context.db.deleteById('products', item.id);
                    this.updateList();
                }}/>
        );

        return (
            <SafeAreaView style={styles.container}>                
                <Text style={globalStyles.screenTitle}>Productos</Text>
                {
                    this.state.productCategories.length == 0 ?
                    <Text>Aún no hay productos</Text>
                    :
                    this.state.productCategories.map(categ => (
                        <View>
                            <Text style={styles.categoryName}>{categ.name}</Text>
                            <FlatList
                                contentContainerStyle={styles.flatlist}
                                data = {categ.list}
                                extraData = {categ.list}
                                keyExtractor = {el => el.id.toString()}
                                renderItem = {renderCard}/>
                        </View>
                    ))
                }
                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{this.props.navigation.navigate('ProductEdit')}}>
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
};