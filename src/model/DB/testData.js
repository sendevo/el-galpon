const generateId = () => Math.random().toString(36).substr(2, 9);
const getId = (table, name) => products_stores[table].find(r => r.name === name)?.id || null;
const startDate = new Date("2024-03-02").getTime();
const maxPeriod = 1000 * 60 * 60 * 24 * 200; // 200 days
const getDate = () => new Date(startDate + Math.random() * maxPeriod).getTime();

/* Nombres:

Productos:
    Glifosato
    Urea granulada
    Trigo
    Maíz
    Girasol
    Silobolsa2,4D
    Suplemento vitamínico

Depositos:
    Agronomia 
    Galpón
    Silo IV
    Silo III
    Tinglado
*/

const products_stores = {
    products: [ 
        {
            id: generateId(),
            name: "Glifosato",
            sku: "10-01111-0",
            pack_size: 20,
            pack_unit: "l",
            expirable: true,
            returnable: true,
            brand: "Estrella",
            comments: "",
            categories: ["Herbicidas"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Urea granulada",
            sku: "03-1234-1",
            pack_size: 1,
            pack_unit: "ton",
            expirable: true,
            returnable: false,
            brand: "Profertil",
            comments: "",
            categories: ["Fertilizantes"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Trigo",
            sku: "",
            pack_size: 25,
            pack_unit: "kg",
            expirable: true,
            returnable: false,
            brand: "ACA 304",
            comments: "Cosecha 2021",
            categories: ["Semillas"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Maíz",
            sku: "",
            pack_size: 80000,
            pack_unit: "semillas",
            expirable: false,
            returnable: false,
            brand: "ACA 477",
            comments: "",
            categories: ["Semillas"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Girasol",
            sku: "",
            pack_size: 180000,
            pack_unit: "semillas",
            expirable: true,
            returnable: false,
            brand: "ACA 220",
            comments: "",
            categories: ["Semillas"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Silobolsa",
            sku: "MA-0000",
            pack_size: 50,
            pack_unit: "m",
            expirable: false,
            returnable: false,
            brand: "Pentasilo Manta",
            comments: "Film de polietileno pentacapa (5 capas), bicolor (exterior blanco e interior negro), coextrusado con plástico virgen de altísima calidad",
            categories: ["Silobolsas"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "2,4D",
            sku: "RD-0021",
            pack_size: 20,
            pack_unit: "l",
            expirable: true,
            returnable: true,
            brand: "Monsanto",
            comments: "",
            categories: ["Herbicidas"],
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Suplemento vitamínico",
            sku: "16-023008",
            pack_size: 25,
            pack_unit: "kg",
            expirable: true,
            returnable: false,
            brand: "AF Mix ADQ Preparto Aniónica",
            comments: "Recomendamos ingresar las vacas al lote y dosificar en la ración 21 días antes del parto",
            categories: ["Nutrición animal"],
            created: getDate(),
            modified: getDate()
        }
    ],
    stores: [
        {
            id: generateId(),
            name: "Agronomia",
            lat: -39.4993953,
            lng: -62.6767609,
            contact: {
                name: "Fulano",
                phone: "299 - 235 15123",
                address: "Calle 38 1231"
            },
            created: getDate(),
            modified: getDate()
            
        },
        {
            id: generateId(),
            name: "Galpón",
            lat: -39.363867,
            lng: -62.685075,
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Silo I",
            lat: -39.365102,
            lng: -62.680214,
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Silo IV",
            lat: -39.365102,
            lng: -62.680214,
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Silo III",
            lat: -39.365102,
            lng: -62.680214,
            created: getDate(),
            modified: getDate()
        },
        {
            id: generateId(),
            name: "Tinglado",
            lat: -39.363867,
            lng: -62.685075,
            created: getDate(),
            modified: getDate()
        }
    ]
};

const testData = {
    version: 0,
    products: products_stores.products,
    stores: products_stores.stores,
    items: [
        {
            id: generateId(),
            product_id: getId("products", "Glifosato"),
            store_id: getId("stores", "Galpón"),
            stock: 10,
            packs: 10,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Glifosato"),
            store_id: getId("stores", "Agronomia"),
            stock: 0,
            packs: 5,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Urea granulada"),
            store_id: getId("stores", "Silo IV"),
            stock: 5.5,
            packs: 0,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Urea granulada"),
            store_id: getId("stores", "Silo III"),
            stock: 2,
            packs: 0,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Urea granulada"),
            store_id: getId("stores", "Agronomia"),
            stock: 2,
            packs: 0,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Maíz"),
            store_id: getId("stores", "Agronomia"),
            stock: 2,
            packs: 0,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Trigo"),
            store_id: getId("stores", "Agronomia"),
            stock: 2,
            packs: 0,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "2,4D"),
            store_id: getId("stores", "Agronomia"),
            stock: 3,
            packs: 5,
            presentation_index: 0,
            expiration_date: getDate()
        },
        {
            id: generateId(),
            product_id: getId("products", "Trigo"),
            store_id: getId("stores", "Silo I"),
            stock: 0,
            packs: 0,
            presentation_index: 0,
            expiration_date: getDate()
        }
    ],
    operations: [
        {
            id: generateId(),
            timestamp: getDate(),
            type: "BUY",
            product_id: getId("products", "Glifosato"),
            store_from_id: null,
            store_to_id: getId("stores", "Agronomia"),
            price: 0,
            stock_amount: 10,
            pack_amount: 10,
            presentation_index: 0,
            observations: ""
        },
        {
            id: generateId(),
            timestamp: getDate(),
            type: "BUY",
            product_id: getId("products", "Glifosato"),
            store_from_id: null,
            store_to_id: getId("stores", "Galpón"),
            price: 0,
            stock_amount: 2,
            pack_amount: 10,
            presentation_index: 0,
            observations: ""
        },
        {
            id: generateId(),
            timestamp: getDate(),
            type: "BUY",
            product_id: getId("products", "Urea granulada"),
            store_from_id: null,
            store_to_id: getId("stores", "Silo IV"),
            price: 0,
            stock_amount: 2,
            pack_amount: 10,
            presentation_index: 0,
            observations: ""
        },
        {
            id: generateId(),
            timestamp: getDate(),
            type: "SPEND",
            product_id: getId("products", "Glifosato"),
            store_from_id: getId("stores", "Agronomia"),
            store_to_id: null,
            price: 0,
            stock_amount: 10,
            pack_amount: 0,
            presentation_index: 0,
            observations: "Aplicado por fulano"
        },
        {
            id: generateId(),
            timestamp: getDate(),
            type: "RETURN_PACKS",
            product_id: getId("products", "Glifosato"),
            store_from_id: getId("stores", "Agronomia"),
            store_to_id: getId("stores", "Agronomia"),
            price: 0,
            stock_amount: 10,
            pack_amount: 0,
            presentation_index: 0,
            observations: ""
        },
        {
            id: generateId(),
            timestamp: getDate(),
            type: "BUY",
            product_id: getId("products", "Trigo"),
            store_from_id: null,
            store_to_id: getId("stores", "Silo I"),
            price: 0,
            stock_amount: 5.5,
            pack_amount: 10,
            presentation_index: 1,
            observations: ""
        },
        ,
        {
            id: generateId(),
            timestamp: getDate(),
            type: "SPEND",
            product_id: getId("products", "Trigo"),
            store_from_id: getId("stores", "Silo I"),
            store_to_id: null,
            price: 0,
            stock_amount: 5.5,
            pack_amount: 10,
            presentation_index: 1,
            observations: "Sembrado en lote 3"
        }
    ],
    alerts: []
};

export default testData;