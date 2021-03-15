import React from 'react';
import { SafeAreaView, 
    ScrollView, 
    TouchableOpacity, 
    Text, 
    View } from 'react-native';
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
        const that = this;
        this.context.db.getTable('products')
        .then(res => {
            // Agrupar productos por categoria
            const grouped = groupBy(res, "cat_id");
            let groupedArr = [];
            for(let c in grouped){ // Convertir a array
                groupedArr.push({ 
                    name: that.context.categories.find(el => el.id == c).name,
                    list: grouped[c]
                });
            }
            that.setState({productCategories: groupedArr});
        })
        .catch(e => console.log(e));
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    render(){
        
        return (
            <SafeAreaView style={styles.container}>  
                <ScrollView>
                    <Text style={globalStyles.screenTitle}>Productos</Text>
                    {
                        this.state.productCategories.length == 0 ?
                        <Text>Aún no hay productos</Text>
                        :
                        this.state.productCategories.map((categ, index) => (
                            <View key={index}>
                                <Text key={index} style={styles.categoryName}>{categ.name}</Text>
                                {
                                    categ.list.map((product, index2) => (
                                        <ProductCard 
                                            item={product} 
                                            key={index2}
                                            onPress={()=>this.props.navigation.navigate('ProductEdit', {product:product})}
                                            onLongPress={()=>{
                                                this.context.db.deleteById('products', product.id);
                                                this.updateList();
                                            }}/>
                                    ))
                                }    
                            </View>
                        ))
                    }
                </ScrollView>
                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{this.props.navigation.navigate('ProductEdit')}}>
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
};