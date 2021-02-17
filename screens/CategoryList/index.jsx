import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../style';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';

export default class CategoryList extends React.Component {

    static contextType = GlobalContext

    state = {
        categoryList: []
    }

    constructor(props){ // Solo para hacer el binding del actualizador
        super(props);
        this.updateList = this.updateList.bind(this);
    }

    updateList() { // Descarga lista de items de la DB y actualiza vista
        this.context.db.getTable("categories")
        .then((res =>{
            this.setState({categoryList:res});
        }));    
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    render() {
        const renderCard = ({item}) => (
            <CardItem 
                item={item} 
                onPress={()=>this.props.navigation.navigate('CategoryEdit', {storage:item})}
                onLongPress={()=>{
                    this.context.db.deleteById('category', item.id);
                    this.updateList();
                }}/>
        );

        return (
            <SafeAreaView style={styles.container}>                
                <Text style={globalStyles.screenTitle}>Categorías</Text>
                <View>
                    {
                        this.state.categoryList.length == 0 ?
                        <Text>Aún no hay categorías</Text>
                        :
                        <FlatList
                            data = {this.state.categoryList}
                            extraData = {this.state.categoryList}
                            keyExtractor = {el => el.id.toString()}
                            renderItem = {renderCard}
                        />            
                    }
                </View>
                
                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{this.props.navigation.navigate('CategoryEdit')}}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}; 

