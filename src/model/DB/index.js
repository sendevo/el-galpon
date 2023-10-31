import {DB_NAME,DB_VERSION} from "../constants";
import {debug} from "../utils";
import schema from "./schema.json";
import {
    getStockOfProduct,
    getOperationsForGood,
    searchTerm
} from "./queries";


export default class LocalDatabase {
    constructor() {
        this._db = null;
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
            this._db.onerror = err => console.error('Database error: ', err);
            debug("DB initilized");
        };

        request.onerror = event => console.error('Database error: ', event.target.error);
    }

    addItem = (data, section) => {
        return new Promise((resolve, reject) => {
            if (this._db) {
                const request = this._db
                    .transaction(section, 'readwrite')
                    .objectStore(section)
                    .add(data);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error);
            } else {
                reject('DB not initialized.');
            }
        });
    }

    removeItem = (itemId, section) => {
        return new Promise((resolve, reject) => {
            if (this._db) {
                const request = this._db
                    .transaction(section, 'readwrite')
                    .objectStore(section)
                    .delete(itemId);
                request.onsuccess = () => resolve();
                request.onerror = (event) => reject(event.target.error);
            } else {
                reject('DB not initialized.');
            }
        });
    }

    getAllItems = section => {
        return new Promise((resolve, reject) => {
            if (this._db) {
                const request = this._db
                    .transaction(section, 'readonly')
                    .objectStore(section)
                    .getAll();
                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => reject(event.target.error);
            } else {
                reject('DB not initialized');
            }
        });
    }

    getItems = (section, page, count) => {
        return new Promise((resolve, reject) => {
            if (this._db) {
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
            }
        });
    }

    // Queries
    searchTerm = (section, attr, term) => searchTerm(this._db, section, attr, term, 3)
    getStockOfProduct = goodId => getStockOfProduct(this._db, goodId)
    getOperationsForGood = goodId => getOperationsForGood(this._db, goodId)
}