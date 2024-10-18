# Depósitos (stores)
Definen lugares en donde pueden ubicarse los insumos. Para consultar la cantidad de insumos en un depósito, se debe recorrer la lista de insumos.  
Los depositos no se pueden eliminar si tienen existencias (items).
```js
{
    id: 0, // (indexedDB -> auto increment, localStorage -> UUID)
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
Definen productos y sus principales características. Los productos pueden ser herbicidas, semillas, fertilizantes, materiales de construcción, insumos veterinarios y demás. Algunos productos tienen envases retornables y fecha de vencimiento. 

??Para cada tipo de presentación hay que crear un nuevo producto??

Los productos no se pueden eliminar si hay stock asociado.

```js
{
    id: 0, // (indexedDB -> auto increment, localStorage -> UUID)
    name: "",
    brand: "",
    comments: "",
    categories: [
        {label: "Herbicidas", key: 0},
        {label: "Fumigacion", key: 1}
    ],
    pack_size: [20], // Varias presentaciones
    pack_unit: ["l"], // Cada presentacion tiene unidad
    expirable: false,
    returnable: false,
    created: 0,
    modified: 0,
    sku: ""
}
```

# Insumos (items)
Los insumos son instancias de productos que se encuentran almacenadas en un depósito. Hay un stock de productos cerrados (o usados en fracción) y un stock de envases vacíos. Si el producto tiene fecha de vencimiento, se puede cargar.    
```js
{
    id: 0, // (indexedDB -> auto increment, localStorage -> UUID)
    product_id: 0,
    store_id: 0,
    stock: 0,
    packs: 0 || null, // Si returnable = true
    presentation_index: 0,
    expiration_date: 0 || null // Si expirable = true
}
```

# Movimientos (operations)
Los movimientos tienen fechas editables pero el resto son datos inmutables, permiten llevar un registro de las operaciones sobre las cantidades de insumos en cada lugar. 
```js
{
    id: 0, // (indexedDB -> auto increment, localStorage -> UUID)
    timestamp: 0,
    type: "", // keywords: BUY, MOVE_STOCK, SPEND, MOVE_PACKS, RETURN_PACKS
    product_id: 0,
    store_from_id: 0 || null,
    store_to_id: 0 || null,
    price: 0, // Costo de operacion (compra, movimiento o devolucion)
    stock_amount: 0, // Siempre positivo o 0
    pack_amount: 0, // Siempre positivo o 0
    presentation_index: 0,
    observations: "" // Mensaje con detalles adicionales
}
```

# Alertas (alerts)
Son mensajes que indican informacion sobre productos por vencerse o por agotarse. El tipo de alerta preconfigura el texto que se muestra en la vista, pero se puede agregar mensajes configurables que tienen mas prioridad que el defecto. El enlace redirige a una vista particular con filtros.
```js
{
    id: 0,
    timestamp: 0,
    type: "", // keywords: EXPIRATION, STOCK, OTHER
    alt_message: "",
    seen: false,
    link: ""
}
```