import React from 'react';
import { SafeAreaView, FlatList, TouchableOpacity, Text, View } from 'react-native';
import globalStyles from '../style';
import styles from './style';
import { GlobalContext } from '../../GlobalContext';

const CardItem = ({ item, onPress }) => (
    <TouchableOpacity 
        style={styles.categoryCard} 
        onPress={onPress}>
            <Text style={styles.categoryName}>{item.name}</Text>            
            <Text>{item.desc}</Text>            
    </TouchableOpacity>
);

export default class CategoryList extends React.Component {

    static contextType = GlobalContext

    render() {
        const renderCard = ({item}) => (
            <CardItem 
                item={item} 
                onPress={()=>this.props.navigation.navigate('CategoryView', {category:item})}
                />
        );

        return (
            <SafeAreaView style={styles.container}>                
                <Text style={globalStyles.screenTitle}>Categorías</Text>
                <View>
                    {
                        this.context.categories.length == 0 ?
                        <Text>Aún no hay categorías</Text>
                        :
                        <FlatList
                            contentContainerStyle={styles.flatlist}
                            data = {this.context.categories}
                            keyExtractor = {el => el.id.toString()}
                            renderItem = {renderCard}
                        />            
                    }
                </View>                
            </SafeAreaView>
        );
    }
}; 

