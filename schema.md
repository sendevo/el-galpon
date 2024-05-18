# Depósitos (stores)
Definen lugares en donde pueden ubicarse los insumos. Para consultar la cantidad de insumos en un depósito, se debe recorrer la lista de insumos.  
```js
{
    id: 0, // auto increment
    name: "",
    comments: "",
    contact: { // Datos de contacto
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

# Productos/Artículos (products)
Definen productos y sus principales características. Los productos pueden ser herbicidas, semillas, fertilizantes, materiales de construcción, insumos veterinarios y demás. Algunos productos tienen envases retornables y fecha de vencimiento. Para cada tipo de presentación hay que crear un nuevo producto.  
```js
{
    id: 0, // auto increment
    name: "",
    brand: "",
    comments: "",
    categories: [
        {label: "Herbicidas", key: 0},
        {label: "Fumigacion", key: 1}
    ],
    pack_size: 20,
    pack_unit: "l",
    expirable: false,
    returnable: false,
    created: 0,
    modified: 0
}
```

# Insumos (items)
Los insumos son instancias de productos que se encuentran almacenadas en un depósito. Hay un stock de productos cerrados (o usados en fracción) y un stock de envases vacíos. Si el producto tiene fecha de vencimiento, se puede cargar.    
```js
{
    id: 0, // auto increment
    product_id: 0,
    store_id: 0,
    stock: 0,
    packs: 0 || null, // Si returnable = true
    expiration_date: 0 || null // Si expirable = true
}
```

# Movimientos (operations)
Los movimientos tienen fechas editables pero el resto son datos inmutables, permiten llevar un registro de las operaciones sobre las cantidades de insumos en cada lugar. 
```js
{
    id: 0, // auto increment
    timestamp: 0,
    type: "", // keywords: BUY, MOVE_STOCK, SPEND, MOVE_PACKS, RETURN_PACKS
    item_id: 0,
    store_from_id: 0 || null,
    store_to_id: 0 || null,
    price: 0, // Costo de operacion (compra, movimiento o devolucion)
    stock_amount: 0, // Siempre positivo o 0
    pack_amount: 0 // Siempre positivo o 0
}
```