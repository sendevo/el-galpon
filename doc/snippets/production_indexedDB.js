import { DB_NAME, DB_VERSION } from "../constants";
import { levenshteinDistance } from "../utils";
import schema from "./schema.json";

export const isValidQuery = query => [
    "getRow",
    "query",
    "getPaginatedRows",
    "getStockOfProduct",
    "getStockInStore",
    "searchTerm"
].includes(query);

export const isValidTable = sectionName => Object.keys(schema).includes(sectionName);

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
            this._db.onerror = err => console.error(err);
            this.onReady.forEach(callback => callback());
            this.onReady = [];
            console.log("DB initialized");
        };

        request.onerror = event => console.log(event.target.error, "error");
    }

    _performTransaction(callback) { // Check if DB is initialized
        console.log(`DB callback stack len: ${this.onReady.length}`);
        if (this._db)
            callback();
        else // Save callback to execute it after DB opens successfully
            this.onReady.push(callback); 
    }

    insert(data, table) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                this._performTransaction( () => {
                    const request = this._db
                        .transaction(table, 'readwrite')
                        .objectStore(table)
                        .put(data);
                    request.onsuccess = () => resolve();
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Table not valid."});
            }
        });
    }

    getRow(rowId, table) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                this._performTransaction(() => {
                    const request = this._db
                        .transaction(table, 'readonly')
                        .objectStore(table)
                        .get(rowId);
                    request.onsuccess = event => {
                        const item = event.target.result;
                        if (item) resolve(item);
                        else reject({message:`Item with ID ${rowId} not found`});
                    };
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Table not valid."});
            }
        });
    }

    delete(rowId, table) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                this._performTransaction(() => {
                    const request = this._db
                        .transaction(table, 'readwrite')
                        .objectStore(table)
                        .delete(rowId);
                    request.onsuccess = () => resolve();
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Table not valid."});
            }
        });
    }

    query(table) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                this._performTransaction(() => {
                    const request = this._db
                        .transaction(table, 'readonly')
                        .objectStore(table)
                        .getAll();
                    request.onsuccess = event => resolve(event.target.result);
                    request.onerror = event => reject(event.target.error);
                });
            }else{
                reject({message:"Table not valid."});
            }
        });
    }

    getPaginatedRows(table, page, count) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                this._performTransaction(() => {
                    const lowerBound = (page - 1) * count;
                    const upperBound = page * count;
                    const keyRange = IDBKeyRange.bound(lowerBound, upperBound, false, false);
                    const data = [];
                    const request = this._db
                        .transaction(table, 'readonly')
                        .objectStore(table)
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
                reject({message:"Table not valid."});
            }
        });
    }

    searchTerm(table, attr, term, thresh = 3) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                this._performTransaction(() => {
                    const results = [];
                    const request = this._db
                        .transaction(table, 'readonly')
                        .objectStore(table)
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
                reject({message:"Table not valid."});
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
                    this.query("stores")
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
                    this.query("products")
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
