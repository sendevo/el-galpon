import { StyleSheet } from 'react-native';

// ItemEdit
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 10
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25,
        margin: 25
    },
    textInput: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 50,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20
    },
    textArea: {
        borderColor: '#CCCCCC',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        height: 100,
        fontSize: 25,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20
    },
    section: {
        margin: 10,
        fontWeight: 'bold'
    }
});

export default styles;