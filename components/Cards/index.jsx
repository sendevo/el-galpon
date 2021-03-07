import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import moment from 'moment';
import { 
    storageStyles, 
    categoryStyles, 
    productStyles, 
    itemStyles } from './style';
import units from '../../database/units';

const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>

const StorageCard = ({ item, onPress, onLongPress }) => (
    <TouchableOpacity 
        style={storageStyles.card} 
        onPress={onPress}
        onLongPress={onLongPress}>
            <Text style={storageStyles.name}>{item.name}</Text>
            <Text><B>Lat:</B> {item.lat.toFixed(4)}</Text>
            <Text><B>Long:</B> {item.long.toFixed(4)}</Text>
            <Text><B>Creado:</B> {moment(item.created).format("DD/MM/YYYY HH:mm")}</Text>
            <Text><B>Modificado:</B> {moment(item.modified).format("DD/MM/YYYY HH:mm")}</Text>
    </TouchableOpacity>
);

const CategoryCard = ({ item, onPress }) => (
    <TouchableOpacity 
        style={categoryStyles.card} 
        onPress={onPress}>
            <Text style={categoryStyles.name}>{item.name}</Text>            
            <Text>{item.desc}</Text>            
    </TouchableOpacity>
);

const ProductCard = ({ item, onPress, onLongPress }) => (
    <TouchableOpacity 
        style={productStyles.card} 
        onPress={onPress}
        onLongPress={onLongPress}>
            <Text style={productStyles.name}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text><B>Cantidad: </B>{item.quantity} {units.find(u => u.id == item.unit_id).long}</Text>
            <Text><B>Precio: $</B>{item.price}</Text>
    </TouchableOpacity>
);

const ItemCard = ({ item, onPress, onLongPress }) => (
    <TouchableOpacity 
        style={itemStyles.card} 
        onPress={onPress}
        onLongPress={onLongPress}>            
            <Text style={itemStyles.number}><B>ID: </B>{item.id}</Text>
            { item.product_name ? <Text><B>Producto: </B>{item.product_name}</Text> : null }
            { item.code ? <Text><B>Código: </B>{item.code}</Text> : null }
            { item.price ? <Text><B>Precio: $</B>{item.price}</Text> : null }
            { item.expiration ? <Text><B>Vencimiento: </B>{moment(item.expiration).format("DD/MM/YYYY")}</Text> : null }
            { item.notes ? <Text>{item.notes}</Text> : null }
            <Text><B>Creado:</B> {moment(item.created).format("DD/MM/YYYY HH:mm")}</Text>
            <Text><B>Modificado:</B> {moment(item.modified).format("DD/MM/YYYY HH:mm")}</Text>
    </TouchableOpacity>
);

export { B, StorageCard, CategoryCard, ProductCard, ItemCard };