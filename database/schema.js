// Esquema para DB SQLite
// A todas las tablas se les agrega los campos id, created y modified por defecto
// TODO: ver tipo de dato necesario para las fotos de deposito, producto o item
const schema = { // Lista de tablas y columnas
    storage: { // Almacenamiento de productos
        columns:{ // Lista de columnas y tipos
            "name": "TEXT",
            "lat": "REAL",
            "long": "REAL"
        }        
    },
    products: { // Detalles de presentacion de productos. Si se eliminan productos, los items pueden quedar sueltos (se pierden).
        columns:{
            "name": "TEXT", 
            "description": "TEXT",
            "cat_id": "INTEGER NOT NULL",
            "subcat_id": "INTEGER",
            "quantity": "REAL", // Volumen de producto de la presentacion
            "unit_id": "INTEGER", // Unidad del volumen (m, kg, l, etc)
            "toxicity": "TEXT",
            "price": "REAL"
        }
    },
    items: { // Instancias de los productos (no se deberian eliminar nunca)
        columns:{
            "product_id": "INTEGER NOT NULL", // Si o si referencia a producto
            "storage_id": "INTEGER",
            "code": "TEXT", // Codigo de barras o algo para ubicar el item
            "expiration": "INTEGER",
            "used": "INTEGER",
            "price": "REAL",
            "notes": "TEXT"
        }
    },
    operations: { // Lista de movimientos de cada item (de un deposito a otro)
        columns:{
            "from_storage_id": "INTEGER",
            "to_storage_id": "INTEGER",
            "item_id": "INTEGER"
        }
    }
};

export default schema;