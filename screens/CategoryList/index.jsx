import React from 'react';
import { SafeAreaView, FlatList, Text, View } from 'react-native';
import globalStyles from '../style';
import styles from './style';
import { GlobalContext } from '../../GlobalContext';
import {CategoryCard} from '../../components/Cards/index';

export default class CategoryList extends React.Component {

    static contextType = GlobalContext

    render() {
        const renderCard = ({item}) => (
            <CategoryCard 
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

