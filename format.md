# Depósitos (stores)
Definen lugares en donde pueden ubicarse los insumos. Para consultar la cantidad de insumos en un depósito, se debe recorrer la lista de insumos.  
```js
{
    id: 0, // auto increment
    hidden: false, // Los depósitos no se pueden eliminar
    name: "",
    person: { // Datos de contacto
        name: "",
        phone: "",
        address: "",
        email: ""
    }, 
    lat: 0,
    lng: 0,
    created: 0,
    modified: 0
}
```

# Productos (products)
Definen productos y sus principales características. Los productos pueden ser herbicidas, semillas, fertilizantes, materiales de construcción, insumos veterinarios y demás. Algunos productos tienen envases retornables y fecha de vencimiento. Para cada tipo de presentación hay que crear un nuevo producto.  
```js
{
    id: 0, // auto increment
    hidden: false, // Los productos no se pueden eliminar
    name: "",
    brand: "",
    manufacturer: "",
    comments: "",
    categories: ["Herbicidas"],
    pack_size: 20,
    pack_unit: "l",
    expirable: false,
    returnable: false,
    created: 0,
    modified: 0
}
```

# Insumos (goods)
Los insumos son instancias de productos que se encuentran almacenadas en un depósito. Hay un stock de productos cerrados (o usados en fracción) y un stock de envases vacíos. Si el producto tiene fecha de vencimiento, se puede cargar.    
```js
{
    id: 0, // auto increment
    product_id: 0,
    store_id: 0,
    stock: 5,
    empty: 0 || null, // Si returnable = true
    expiration_date: 0 || null
}
```

# Movimientos (operations)
Los movimientos permiten llevar un registro de las operaciones sobre las cantidades de insumos en cada lugar. 
```js
{
    id: 0, // auto increment
    timestamp: 0,
    type: "", // BUY, MOVE, SPEND, RETURN
    good_id: 0,
    store_from_id: 0 || null,
    store_to_id: 0 || null,
    price: 0, // Costo de operacion (compra, movimiento o devolucion)
    stock_amount: 0, // Siempre positivo o 0
    empty_amount: 0 // Siempre positivo o 0
}
```