import React from 'react';
import { SafeAreaView, Text} from 'react-native';
import styles from './style';
import { GlobalContext } from '../../GlobalContext';

export default class CategoryView extends React.Component {

    static contextType = GlobalContext

    state = {
        id: null, // ID de la categoria
        name: "", // Nombre no debe ser vacio para guardar
        desc: "", // Descripcion de la categoria
        itemList: [] // Lista de items de esta categoria
    }

    constructor(props) {
        super(props);
        this.state = props?.route?.params?.category;
    }

    render() {        
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>{this.state.name}</Text>
                <Text style={styles.description}>{this.state.desc}</Text>
                <Text style={styles.subtitle}>Items de esta categoría:</Text>
            </SafeAreaView>
        );
    }
};
