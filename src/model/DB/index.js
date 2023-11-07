import { DB_NAME,DB_VERSION } from "../constants";
import { debug } from "../utils";
import schema from "./schema.json";
import {
    getStockOfProduct,
    getOperationsForGood,
    searchTerm
} from "./queries";


// TODO: remove this
const productsTempData = [ 
    {
        id: 34,
        name: "Glifosato",
        pack_size: 20,
        pack_unit: "l",
        expirable: true,
        returnable: true,
        brand: "Estrella",
        comments: "",
        categories: ["Herbicidas"],
        created: 1693683312000,
        modified: 1693683312000
    },
    {
        id: 35,
        name: "Urea granulada",
        pack_size: 1,
        pack_unit: "ton",
        expirable: true,
        returnable: false,
        brand: "Profertil",
        comments: "",
        categories: ["Fertilizantes"],
        created: 1693683312000,
        modified: 1693683312000
    },
    {
        id: 38,
        name: "Trigo",
        pack_size: 25,
        pack_unit: "kg",
        expirable: true,
        returnable: false,
        brand: "ACA 304",
        comments: "Cosecha 2021",
        categories: ["Semillas"],
        created: 1693683312000,
        modified: 1693683312000
    }
];

const storesTempData = [
    {
        id: 34,
        name: "YPF Agro - Pedro Luro",
        lat: -39.4993953,
        lng: -62.6767609,
        contact: {
            name: "Fulano",
            phone: "299 - 235 15123",
            address: "Calle 38 1231"
        },
        created: 1693683312000,
        modified: 1693683312000
        
    },
    {
        id: 35,
        name: "Galpón",
        lat: -39.363867,
        lng: -62.685075,
        created: 1693683312000,
        modified: 1693683312000
    },
    {
        id: 36,
        name: "Silo IV",
        lat: -39.365102,
        lng: -62.680214,
        created: 1693683312000,
        modified: 1693683312000
    },
    {
        id: 37,
        name: "Silito",
        lat: -39.365102,
        lng: -62.680214,
        created: 1693683312000,
        modified: 1693683312000
    }
];

export default class LocalDatabase {
    constructor() {
        this._db = null;
        this.onReady = () => {};

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            this._db = event.target.result;
            Object.keys(schema).forEach(key => {
                const store = this._db.createObjectStore(key, schema[key].options);
                if (schema[key].indexes)
                    schema[key].indexes.forEach(index => store.createIndex(index.name, index.keyPath, index.options));
            });
        };

        request.onsuccess = event => {
            this._db = event.target.result;
            this._db.onerror = err => debug(err, "error");

            // TODO: remove this
            this.getItem(34, "products")
                .then(() => {
                    console.log("test data already there");
                    this.onReady();
                })
                .catch(() => {
                    const job = [
                        ...productsTempData.map(data => this.addItem(data, "products")),
                        ...storesTempData.map(data => this.addItem(data, "stores"))
                    ];
                    Promise.all(job)
                        .then(() => {
                            debug("DB initilized");
                            this.onReady();
                        })
                        .catch(console.error);
                });

            // TODO: uncomment this
            //debug("DB initilized");
            //this.onReady();
        };

        request.onerror = event => debug(event.target.error, "error");
    }

    performTransaction = callback => {
        if (this._db) callback();
        else this.onReady = callback;
    }

    addItem = (data, section) => {
        return new Promise((resolve, reject) => {
            this.performTransaction( () => {
                const request = this._db
                    .transaction(section, 'readwrite')
                    .objectStore(section)
                    .put(data);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getItem = (itemId, section) => {
        return new Promise((resolve, reject) => {
            this.performTransaction(() => {
                const request = this._db
                    .transaction(section, 'readonly')
                    .objectStore(section)
                    .get(itemId);
        
                request.onsuccess = (event) => {
                    const product = event.target.result;
                    if (product) resolve(product);
                    else reject(`Item with ID ${itemId} not found`);
                };
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    removeItem = (itemId, section) => {
        return new Promise((resolve, reject) => {
            this.performTransaction(() => {
                const request = this._db
                    .transaction(section, 'readwrite')
                    .objectStore(section)
                    .delete(itemId);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getAllItems = section => {
        return new Promise((resolve, reject) => {
            this.performTransaction(() => {
                const request = this._db
                    .transaction(section, 'readonly')
                    .objectStore(section)
                    .getAll();
                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getItems = (section, page, count) => {
        return new Promise((resolve, reject) => {
            this.performTransaction(() => {
                const lowerBound = (page - 1) * count;
                const upperBound = page * count;
                const keyRange = IDBKeyRange.bound(lowerBound, upperBound, false, false);
                const data = [];
                const request = this._db
                    .transaction(section, 'readonly')
                    .objectStore(section)
                    .openCursor(keyRange);
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        data.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(data);
                    }
                };
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    // Queries
    searchTerm = (section, attr, term) => searchTerm(this._db, section, attr, term, 3)
    getStockOfProduct = goodId => getStockOfProduct(this._db, goodId)
    getOperationsForGood = goodId => getOperationsForGood(this._db, goodId)
}





