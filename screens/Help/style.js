import {StyleSheet} from 'react-native';

// Help
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center'
    },
    background: {
        flex: 1,
        alignItems: 'center',
        resizeMode: 'contain',
        justifyContent: "center",
        opacity: 0.8
    },
    scrollview: {
        marginTop: 200
    },
    buttons: {
        backgroundColor: 'rgb(250,250,250)',
        borderRadius: 5,
        padding: 15,
        marginTop: 10,
        width: 250,
        alignItems: 'center'
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 18
    }
});

export default styles;