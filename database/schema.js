const schema = { // Tablas y sus columnas
    "storage": {        
        columns:{
            "name": "TEXT",
            "lat": "REAL",
            "long": "REAL"
        }        
    },
    "products": {        
        columns:{
            "name": "TEXT", 
            "description": "TEXT",
            "categ_id": "INTEGER",
            "quantity": "REAL", 
            "quantity_unit": "INTEGER",
            "toxicity_lvl": "INTEGER",
            "ref_price": "REAL"
        }
    },
    "items": {
        columns:{
            "product_id": "INTEGER",
            "storage_id": "INTEGER",
            "code": "TEXT",
            "expiration": "INTEGER",
            "used": "INTEGER",
            "price": "REAL",
            "notes": "TEXT"
        }
    },
    "operations": {
        columns:{
            "from_storage_id": "INTEGER",
            "to_storage_id": "INTEGER",
            "item_id": "INTEGER"
        }
    }
};

export default schema;