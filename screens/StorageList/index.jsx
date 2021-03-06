import React from 'react';
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import globalStyles from '../style';
import styles from './style';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import { StorageCard } from '../../components/Cards/index';
import { update } from 'lodash';

export default class StorageList extends React.Component {

    static contextType = GlobalContext

    state = {
        storageList: [],
        default_storage: null,
    }

    constructor(props, context){ // Solo para hacer el binding del actualizador
        super(props);
        this.state.default_storage = context.db.config.default_storage;
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

    setDefaultStorage(id) {
        const updateState = () => {this.setState({default_storage: id})};
        this.context.db.setConfig("default_storage", id)
        .then(res => {
            updateState();
        })
        .catch(e => console.log(e));
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>                
                <Text style={globalStyles.screenTitle}>Depósitos</Text>
                <View>
                    {
                        this.state.storageList.length == 0 ?
                        <Text>Aún no hay depósitos</Text>
                        :
                        this.state.storageList.map((item)=>(
                            <View style={styles.cardContainer}>
                                <Checkbox
                                    value={item.id == this.state.default_storage}
                                    onValueChange={v=>this.setDefaultStorage(item.id)}
                                />

                                <StorageCard 
                                    item={item} 
                                    key={item.id}
                                    onPress={()=>this.props.navigation.navigate('StorageEdit', {storage:item})}
                                    onLongPress={()=>{
                                        this.context.db.deleteById('storage', item.id);
                                        this.updateList();
                                    }}/>
                            </View>
                        ))
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

