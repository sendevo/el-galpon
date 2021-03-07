import React from 'react';
import { SafeAreaView, ScrollView, View, Text} from 'react-native';
import styles from './style';
import { GlobalContext } from '../../GlobalContext';
import { ItemCard } from '../../components/Cards/index';
import groupBy from 'lodash/groupBy';

export default class CategoryView extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null, // ID de la categoria
        name: "", // Nombre no debe ser vacio para guardar
        desc: "", // Descripcion de la categoria
        productList: [] // Lista de items de esta categoria agrupados por producto
    }

    constructor(props) {
        super(props);
        this.state = props?.route?.params?.category;
        this.state.productList = [];
        this.updateList = this.updateList.bind(this);
    }

    updateList() {
        // El nombre de producto es p_name para que no aparezca en la tarjeta de item
        const statement = `
            SELECT p.name AS p_name, i.* 
            FROM items i
            INNER JOIN products p ON (p.id = i.product_id)
            WHERE p.cat_id = ?
        `;
        const that = this; // Para referenciar en el callback de la promesa
        this.context.db.execute(statement, [this.state.id])
        .then(({rows:{_array}}) => {
            const grouped = groupBy(_array, "product_id");
            let groupedArr = [];
            for(let c in grouped){
                groupedArr.push({
                    name: _array.find(el => el.product_id == c).p_name,
                    list: grouped[c]
                });
            }
            that.setState({productList: groupedArr});
        })
        .catch(e => console.log(e));
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    render() {        
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>{this.state.name}</Text>
                    <Text style={styles.description}>{this.state.desc}</Text>
                    {
                        this.state.productList.length > 0 ?
                            <View>
                                <Text style={styles.subtitle}>Items de esta categoría:</Text>
                                {
                                    this.state.productList.map( (product, index) => (
                                        <View key={index}>
                                            <Text key={index} style={styles.productName}>{product.name}</Text>
                                            {
                                                product.list.map((item, index2)=>(
                                                    <ItemCard 
                                                        item={item} 
                                                        key={index2}
                                                        onPress={()=>this.props.navigation.navigate('ItemEdit', {item_id: item.id})}/>
                                                ))
                                            }
                                        </View>
                                    ))
                                }
                            </View>
                        :
                            null
                    }
                </ScrollView>
            </SafeAreaView>
        );
    }
};
