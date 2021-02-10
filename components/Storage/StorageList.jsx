import React, { Component }  from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../globals';
import styles from './storageList';
import { Ionicons } from '@expo/vector-icons';
import { GlobalContext } from '../../GlobalContext';
import B from '../Misc';


const CardItem = ({ item, onPress, onLongPress }) => (
    <TouchableOpacity 
        style={styles.storageCard} 
        onPress={onPress}
        onLongPress={onLongPress}>
            <Text style={styles.storageName}>{item.name}</Text>
            <Text><B>Lat:</B> {item.lat.toFixed(4)}</Text>
            <Text><B>Long:</B> {item.long.toFixed(4)}</Text>
            <Text><B>Creado:</B> {item.created}</Text>
            <Text><B>Modificado:</B> {item.modified}</Text>
    </TouchableOpacity>
);


export default class StorageList extends Component {

    static contextType = GlobalContext

    state = {
        storageList: []
    }

    componentDidMount() {
        // Actualizar lista cuando la vista tiene foco
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.context.db.getTable("storage")
            .then((res =>{
                this.setState({storageList:res});
            }));    
        });
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        const renderCard = ({item}) => (
            <CardItem 
                item={item} 
                onPress={()=>this.props.navigation.navigate('StorageEdit', {storage:item})}
                onLongPress={()=>{
                    this.context.db.deleteById('storage', item.id);
                    this.context.db.getTable("storage")
                    .then((res =>{
                        this.setState({storageList:res});
                    }));    
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
                            data = {this.state.storageList}
                            extraData = {this.state.storageList}
                            keyExtractor = {el => el.id.toString()}
                            renderItem = {renderCard}
                        />            
                    }
                </View>
                
                <TouchableOpacity 
                    style={globalStyles.floatingButton}
                    onPress={()=>{
                        this.props.navigation.navigate('StorageEdit')
                    }}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}; 

