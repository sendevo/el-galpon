import React, { Component }  from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../../style/globals';
import styles from '../../style/storage';
import { GlobalContext } from '../../GlobalContext';
import { Ionicons } from '@expo/vector-icons';


export default class StorageList extends Component {

    static contextType = GlobalContext

    state = {
        storageList: []
    }

    constructor(props, context){
        super(props);

        context.db.getTable("Storage") // Descargar lista de depositos
        .then((res =>{
            this.setState({storageList:res});
        }));
    }

    render (){
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
                            numColumns = {2}
                            keyExtractor = { el => el.id }
                            renderItem = { 
                                ({ item }) => (
                                    <TouchableOpacity style={styles.storageCard}>
                                      <Text style={styles.storageName}>{item.name}</Text>
                                      <Text>Lat: {item.lat}</Text>
                                      <Text>Long: {item.long}</Text>
                                    </TouchableOpacity>
                                )
                             }
                        />            
                    }
                </View>
                
                <TouchableOpacity style={globalStyles.floatingButton}>
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}; 

