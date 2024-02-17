import { DB_NAME, DB_VERSION, OPERATION_TYPES } from "../constants";
import { debug, levenshteinDistance } from "../utils";
import schema from "./schema.json";

export const isValidQuery = query => [
    "getItem",
    "getAllItems",
    "getPaginatedItems",
    "getStockOfProduct",
    "getStockInStore",
    "searchTerm"
].includes(query);

export const isValidSection = sectionName => Object.keys(schema).includes(sectionName);

export default class LocalDatabase {
    constructor() {
        this.type = "production";
        this._db = null;
        
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            this._db = event.target.result;
            Object.keys(schema).forEach(key => {
                const store = this._db.createObjectStore(key, schema[key].options);
                if (schema[key].indexes)
                    schema[key].indexes
                        .forEach(index => store.createIndex(
                            index.name, 
                            index.keyPath, 
                            index.options)
                        );
            });
        };

        this.onReady = []; // List of callbacks
        request.onsuccess = event => {
            this._db = event.target.result;
            this._db.onerror = err => debug(err, "error");
            this.onReady.forEach(callback => callback());
            this.onReady = [];
            debug("DB initialized");
        };

        request.onerror = event => debug(event.target.error, "error");
    }

    _performTransaction(callback) { // Check if DB is initialized
        debug(`DB callback stack len: ${this.onReady.length}`);
        if (this._db)
            callback();
        else // Save callback to execute it after DB opens successfully
            this.onReady.push(callback); 
    }

    addItem(data, section) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction( () => {
                    const request = this._db
                        .transaction(section, 'readwrite')
                        .objectStore(section)
                        .put(data);
                    request.onsuccess = () => resolve();
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    getItem(itemId, section) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const request = this._db
                        .transaction(section, 'readonly')
                        .objectStore(section)
                        .get(itemId);
                    request.onsuccess = event => {
                        const item = event.target.result;
                        if (item) resolve(item);
                        else reject({message:`Item with ID ${itemId} not found`});
                    };
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    removeItem(itemId, section) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const request = this._db
                        .transaction(section, 'readwrite')
                        .objectStore(section)
                        .delete(itemId);
                    request.onsuccess = () => resolve();
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    getAllItems(section) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const request = this._db
                        .transaction(section, 'readonly')
                        .objectStore(section)
                        .getAll();
                    request.onsuccess = event => resolve(event.target.result);
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    getPaginatedItems(section, page, count) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const lowerBound = (page - 1) * count;
                    const upperBound = page * count;
                    const keyRange = IDBKeyRange.bound(lowerBound, upperBound, false, false);
                    const data = [];
                    const request = this._db
                        .transaction(section, 'readonly')
                        .objectStore(section)
                        .openCursor(keyRange);
                    request.onsuccess = event => {
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
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    searchTerm(section, attr, term, thresh = 3) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const results = [];
                    const request = this._db
                        .transaction(section, 'readonly')
                        .objectStore(section)
                        .openCursor();
                    request.onsuccess = event => {
                        const cursor = event.target.result;
                        if (cursor) {
                            const similarity = levenshteinDistance(term, cursor.value[attr]);
                            if (similarity <= thresh) 
                                results.push({id: cursor.value.id, similarity});
                            cursor.continue();
                        } else {
                            results.sort((a, b) => a.similarity - b.similarity);
                            resolve(results);
                        }
                    };
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Section not valid."});
            }
        });
    }


    // Business model specific functions

    getStockOfProduct(productId) {
        return new Promise((resolve, reject) => {
            this._performTransaction(() => {
                const request = this._db
                    .transaction(['items'], 'readonly')
                    .objectStore('items')
                    .index('product_id')
                    .getAll(IDBKeyRange.only(productId));
                request.onsuccess = event => {
                    const itemData = event.target.result;
                    // For each item, add store data
                    this.getAllItems("stores")
                        .then(stores => {
                            resolve(
                                itemData.map(g => {
                                    const storeIndex = stores.findIndex(s => s.id === g.store_id);
                                    return {
                                        ...g,
                                        storeData: storeIndex !== -1 ? stores[storeIndex] : {}
                                    };
                                })
                            );
                        })
                        .catch(reject);
                };
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    getStockInStore(storeId) {
        return new Promise((resolve, reject) => {
            this._performTransaction(() => {
                const request = this._db
                    .transaction(['items'], 'readonly')
                    .objectStore('items')
                    .index('store_id')
                    .getAll(IDBKeyRange.only(storeId));
                request.onsuccess = event => {
                    const itemData = event.target.result;
                    this.getAllItems("products")
                        .then(products => {
                            resolve(
                                itemData.map(g => {
                                    const productIndex = products.findIndex(s => s.id === g.product_id);
                                    return {
                                        ...g, 
                                        productData: productIndex !== -1 ? products[productIndex] : {}
                                    };
                                })
                            )
                        })
                }
                request.onerror = event => reject(event.target.error);
            });
        });
    }

    buyStock(itemId, amount, storeId, price) {
        return new Promise((resolve, reject) => {

        });
    }

    moveStock(itemId, amount, toStoreId) {
        return new Promise((resolve, reject) => {

        });
    }

    spendStock(itemId, amount) {
        return new Promise((resolve, reject) => {

        });
    }

    returnPacks(itemId, amount) {
        return new Promise((resolve, reject) => {

        });
    }
}
