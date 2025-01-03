import {
    ALERT_TYPES,
    MONTH,
    DAY
} from "../constants";
import schemas from "./schemas.json";

const generateId = () => Math.random().toString(36).substr(2, 9);
const getId = (table, name) => table.find(r => r.name === name)?.id || null;

const maxPeriod = 60 * DAY;
const getRandomFutureDate = () => new Date(Date.now() + Math.random() * maxPeriod).getTime();
const getRandomPastDate = () => new Date(Date.now() - Math.random() * maxPeriod).getTime();

const timeAgo = (time) => Math.floor(Date.now() - time);

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

const getItemId = (productName, storeName) => {
    const product = products.find(p => p.name === productName);
    const store = stores.find(s => s.name === storeName);
    return items.find(i => i.product_id === product.id && i.store_id === store.id)?.id || null;
}

const products = [ 
    {
        id: generateId(),
        name: "Glifosato",
        sku: "10-01111-0",
        presentations: [
            {
                unit: "liter",
                pack_size: 40,
                bulk: false
            }
        ],
        expirable: true,
        returnable: true,
        brand: "Estrella",
        comments: "",
        categories: ["Herbicidas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Dicamba",
        sku: "10-05121-0",
        presentations: [
            {
                unit: "liter",
                pack_size: 40,
                bulk: false
            }
        ],
        expirable: true,
        returnable: true,
        brand: "Dicamax aca 58",
        comments: "",
        categories: ["Herbicidas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Atrazina",
        sku: "10-24123-0",
        presentations: [
            {
                unit: "liter",
                pack_size: 80,
                bulk: false
            }
        ],
        expirable: true,
        returnable: true,
        brand: "Atrazina lq 90 (R)",
        comments: "",
        categories: ["Herbicidas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Urea granulada",
        sku: "03-1234-1",
        presentations: [
            {
                unit: "ton",
                pack_size: null,
                bulk: true
            }
        ],
        expirable: true,
        returnable: false,
        brand: "Profertil",
        comments: "",
        categories: ["Fertilizantes"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Trigo",
        sku: "",
        presentations: [
            {
                unit: "kilogram",
                pack_size: 50,
                bulk: false
            },
            {
                unit: "ton",
                pack_size: null,
                bulk: true
            }
        ],
        expirable: false,
        returnable: false,
        brand: "ACA 304",
        comments: "Cosecha 2021",
        categories: ["Semillas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Maíz",
        sku: "",
        presentations: [
            {
                unit: "bag",
                pack_size: 1,
                bulk: false
            }
        ],
        expirable: false,
        returnable: false,
        brand: "ACA 477",
        comments: "",
        categories: ["Semillas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Girasol",
        sku: "",
        presentations: [
            {
                unit: "bag",
                pack_size: 1,
                bulk: false
            },
            {
                unit: "ton",
                pack_size: null,
                bulk: true
            }
        ],
        expirable: false,
        returnable: false,
        brand: "ACA 220",
        comments: "",
        categories: ["Semilla"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Silobolsa",
        sku: "MA-0000",
        presentations: [
            {
                unit: "unit",
                pack_size: 50,
                bulk: false
            }
        ],
        expirable: false,
        returnable: false,
        brand: "Pentasilo Manta",
        comments: "Film de polietileno pentacapa (5 capas), bicolor (exterior blanco e interior negro), coextrusado con plástico virgen de altísima calidad",
        categories: ["Silobolsas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "2,4D",
        sku: "RD-0021",
        presentations: [
            {
                unit: "liter",
                pack_size: 20,
                bulk: false
            }
        ],
        expirable: true,
        returnable: true,
        brand: "Monsanto",
        comments: "",
        categories: ["Herbicidas"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Suplemento vitamínico",
        sku: "16-023008",
        presentations: [
            {
                unit: "kilogram",
                pack_size: 25,
                bulk: false
            }
        ],
        expirable: true,
        returnable: false,
        brand: "AF Mix ADQ Preparto Aniónica",
        comments: "Recomendamos ingresar las vacas al lote y dosificar en la ración 21 días antes del parto",
        categories: ["Nutrición animal"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Piedra de magnesio",
        sku: "",
        presentations: [
            {
                unit: "kilogram",
                pack_size: 18,
                bulk: false
            }
        ],
        expirable: true,
        returnable: false,
        brand: "Biofarma",
        comments: "Aporta magnesio de rápida disponibilidad. Rsencial en la prevención de la tetania de los pastos.",
        categories: ["Nutrición animal"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Varilla 1.5x2x120",
        sku: "",
        presentations: [
            {
                unit: "unit",
                pack_size: 9,
                bulk: false
            }
        ],
        expirable: false,
        returnable: false,
        brand: "ER Agrícola",
        comments: "",
        categories: ["Alambrados"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Gasoil",
        sku: "",
        presentations: [
            {
                unit: "liter",
                pack_size: 200,
                bulk: false
            }
        ],
        expirable: false,
        returnable: true,
        brand: "YPF",
        comments: "",
        categories: ["Combustibles"],
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    }
];
const stores = [
    {
        id: generateId(),
        name: "Agronomia",
        lat: -39.4993953,
        lng: -62.6767609,
        contact: {
            name: "Fulano",
            phone: "011 - 235 15123",
            address: "Calle 38 1231"
        },
        created: getRandomPastDate(),
        modified: getRandomPastDate()
        
    },
    {
        id: generateId(),
        name: "Acopiador",
        lat: -38.385738,
        lng: -60.272519,
        contact: {
            name: "Mengano",
            phone: "291 - 235 15123",
            address: "Calle 1 31"
        },
        created: getRandomPastDate(),
        modified: getRandomPastDate()
        
    },
    {
        id: generateId(),
        name: "Galpón",
        lat: -39.363867,
        lng: -62.685075,
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Silo I",
        lat: -39.365102,
        lng: -62.680214,
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Silo IV",
        lat: -39.365102,
        lng: -62.680214,
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Silo III",
        lat: -39.365102,
        lng: -62.680214,
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    },
    {
        id: generateId(),
        name: "Tinglado",
        lat: -39.363867,
        lng: -62.685075,
        created: getRandomPastDate(),
        modified: getRandomPastDate()
    }
];

const items = [
    {
        id: generateId(),
        product_id: getId(products, "Glifosato"),
        store_id: getId(stores, "Galpón"),
        stock: 60,
        min_stock: 90,
        empty_packs: 10,
        presentation_index: 0,
        expiration_date: timeAgo(-10*DAY)
    },
    {
        id: generateId(),
        product_id: getId(products, "Glifosato"),
        store_id: getId(stores, "Agronomia"),
        stock: 480,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Dicamba"),
        store_id: getId(stores, "Galpón"),
        stock: 0,
        min_stock: 0,
        empty_packs: 5,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Dicamba"),
        store_id: getId(stores, "Agronomia"),
        stock: 400,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Urea granulada"),
        store_id: getId(stores, "Silo IV"),
        stock: 5.5,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Urea granulada"),
        store_id: getId(stores, "Silo III"),
        stock: 2,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Urea granulada"),
        store_id: getId(stores, "Acopiador"),
        stock: 2.5,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Maíz"),
        store_id: getId(stores, "Agronomia"),
        stock: 360000,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Trigo"),
        store_id: getId(stores, "Acopiador"),
        stock: 2,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "2,4D"),
        store_id: getId(stores, "Galpón"),
        stock: 40,
        min_stock: 80,
        empty_packs: 5,
        presentation_index: 0,
        expiration_date: timeAgo(-15*DAY)
    },
    {
        id: generateId(),
        product_id: getId(products, "2,4D"),
        store_id: getId(stores, "Agronomia"),
        stock: 65,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    },
    {
        id: generateId(),
        product_id: getId(products, "Trigo"),
        store_id: getId(stores, "Silo I"),
        stock: 5,
        min_stock: 0,
        empty_packs: 0,
        presentation_index: 0,
        expiration_date: getRandomFutureDate()
    }
];

const operations = [
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "BUY",
        items_data: [{
            product_id: getId(products, "Piedra de magnesio"),
            store_from_id: getId(stores, "Agronomia"),
            store_to_id: getId(stores, "Galpón"),
            price: 0,
            amount: 1,
            presentation_index: 0
        }],
        observations: ""
    },
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "BUY",
        items_data: [{
            product_id: getId(products, "Glifosato"),
            store_from_id: null,
            store_to_id: getId(stores, "Galpón"),
            price: 0,
            amount: 120,
            presentation_index: 0
        },
        {
            product_id: getId(products, "2,4D"),
            store_from_id: null,
            store_to_id: getId(stores, "Galpón"),
            price: 0,
            amount: 80,
            presentation_index: 0
        }],
        observations: ""
    },
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "BUY",
        items_data: [{
            product_id: getId(products, "Urea granulada"),
            store_from_id: null,
            store_to_id: getId(stores, "Silo IV"),
            price: 0,
            amount: 2,
            presentation_index: 0
        }],
        observations: ""
    },
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "SPEND",
        items_data: [{
            product_id: getId(products, "Glifosato"),
            store_from_id: getId(stores, "Agronomia"),
            store_to_id: null,
            price: 0,
            amount: 350,
            pack_amount: 0,
            presentation_index: 0
        }],
        observations: "Aplicado por fulano"
    },
    {
        id: generateId(),
        timestamp: Date.now() - 7*DAY,
        type: "RETURN_PACKS",
        items_data: [{
            product_id: getId(products, "Glifosato"),
            store_from_id: getId(stores, "Galpón"),
            store_to_id: null,
            price: 0,
            amount: 5,
            presentation_index: 0
        },
        {
            product_id: getId(products, "Atrazina"),
            store_from_id: getId(stores, "Galpón"),
            store_to_id: null,
            price: 0,
            amount: 2,
            presentation_index: 0
        },
        {
            product_id: getId(products, "Dicamba"),
            store_from_id: getId(stores, "Galpón"),
            store_to_id: null,
            price: 0,
            amount: 5,
            pack_amount: 5,
            presentation_index: 0
        }],
        observations: ""
    },
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "BUY",
        items_data: [{
            product_id: getId(products, "Trigo"),
            store_from_id: null,
            store_to_id: getId(stores, "Silo I"),
            price: 0,
            amount: 5.5,
            presentation_index: 1
        }],
        observations: ""
    },
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "SPEND",
        items_data: [{
            product_id: getId(products, "Trigo"),
            store_from_id: getId(stores, "Silo I"),
            store_to_id: null,
            price: 0,
            amount: 5.5,
            presentation_index: 1
        }],
        observations: "Sembrado en lote 3"
    },
    {
        id: generateId(),
        timestamp: getRandomPastDate(),
        type: "RETURN_PACKS",
        items_data: [{
            product_id: getId(products, "2,4D"),
            store_from_id: getId(stores, "Galpón"),
            store_to_id: null,
            price: 0,
            amount: 2,
            presentation_index: 0
        },
        {
            product_id: getId(products, "Dicamba"),
            store_from_id: getId(stores, "Galpón"),
            store_to_id: null,
            price: 0,
            amount: 10,
            presentation_index: 0
        }],
        observations: ""
    }
];


const alerts = [
    /*
    {
        id: generateId(),
        item_id: getItemId("Trigo", "Silo I"),
        timestamp: timeAgo(2*DAY),
        alert_type: "LOW_STOCK",
        seen: true
    },
    {
        id: generateId(),
        item_id: getItemId("Urea granulada", "Silo IV"),
        timestamp: timeAgo(3*DAY),
        alert_type: "LOW_STOCK",
        seen: true
    },
    {
        id: generateId(),
        item_id: getItemId("2,4D", "Galpón"),
        timestamp: Date.now(),
        alert_type: "EXPIRED",
        seen: false
    },
    {
        id: generateId(),
        item_id: getItemId("Glifosato", "Galpón"),
        timestamp: timeAgo(3.4*MONTH),
        alert_type: "EXPIRED",
        seen: false
    },
    {
        id: generateId(),
        item_id: getItemId("Glifosato", "Galpón"),
        timestamp: timeAgo(5*MONTH),
        alert_type: "LOW_STOCK",
        seen: true
    }
    */
];


const unvisitedViews = [ // Used for introduction messages
    "about",
    "alertsList",
    "operationForm",
    "operationsList",
    "productsList",
    "productForm",
    "stock",
    "storesList",
    "storeForm",
    "returns"
];

const testData = {
    version: schemas.length - 1,
    locale: "es",
    products,
    stores,
    items,
    operations,
    alerts,
    unvisitedViews 
};

export default testData;