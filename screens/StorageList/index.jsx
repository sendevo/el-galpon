import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../style';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import { StorageCard } from '../../components/Cards/index';

export default class StorageList extends React.Component {

    static contextType = GlobalContext

    state = {
        storageList: []
    }

    constructor(props){ // Solo para hacer el binding del actualizador
        super(props);
        this.updateList = this.updateList.bind(this);
    }

    updateList() { // Descarga lista de items de la DB y actualiza vista
        this.context.db.getTable("storage")
        .then(res =>{
            this.setState({storageList:res});
        });    
    }

    componentDidMount() { // Actualizar lista cuando la vista tiene foco (dispara luego de crear)
        this._unsubscribe = this.props.navigation.addListener('focus', this.updateList);
    }

    componentWillUnmount() { // Desuscribir del listener
        this._unsubscribe();
    }

    render() {
        const renderCard = ({item}) => (
            <StorageCard 
                item={item} 
                onPress={()=>this.props.navigation.navigate('StorageEdit', {storage:item})}
                onLongPress={()=>{
                    this.context.db.deleteById('storage', item.id);
                    this.updateList();
                }}/>
        );

        return (
            <SafeAreaView style={styles.container}>                
                <Text style={globalStyles.screenTitle}>Depósitos</Text>
                <View>
                    {
                        this.state.storageList.length == 0 ?
                        <Text>Aún no hay depósitos</Text>
                        :
                        <FlatList
                            contentContainerStyle={styles.flatlist}
                            data = {this.state.storageList}
                            extraData = {this.state.storageList}
                            keyExtractor = {el => el.id.toString()}
                            renderItem = {renderCard}
                        />            
                    }
                </View>
                
                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{this.props.navigation.navigate('StorageEdit')}}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}; 

