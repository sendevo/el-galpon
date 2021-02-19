import { StyleSheet } from 'react-native';

// Estilos de tarjetas
const storageStyles = StyleSheet.create({
    card: {
        backgroundColor: 'rgb(200,200,200)',
        borderRadius: 10,
        padding: 20,
        margin: 5
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    }
});

const categoryStyles = StyleSheet.create({
    card: {
        backgroundColor: 'rgb(220,220,220)',
        borderRadius: 10,
        padding: 20,
        margin: 5
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    }
});

const productStyles = StyleSheet.create({
    card: {
        backgroundColor: 'rgb(200,200,200)',
        borderRadius: 10,
        padding: 20,
        margin: 5
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20
    }
});

export { storageStyles, categoryStyles, productStyles };