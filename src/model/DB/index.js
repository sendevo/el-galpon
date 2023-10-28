import {
    DB_NAME,
    DB_VERSION
} from "../constants"

export default class DBService {
    constructor() {
        this._db = null;
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = event => {
            this._db = event.target.result;

            this._db.createObjectStore('stores', {
                keyPath: 'id',
                autoIncrement: true
            });
            
            this._db.createObjectStore('products', {
                keyPath: 'id',
                autoIncrement: true
            });
            
            this._db
            .createObjectStore('goods', {
                keyPath: 'id',
                autoIncrement: true
            })
            .createIndex('store_id', 'store_id', { unique: false })
            .createIndex('product_id', 'product_id', { unique: false });
        };

        request.onsuccess = event => {
            this._db = event.target.result;
            this._db.onerror = err => console.error('Database error: ', err);
        };

        request.onerror = event => console.error('Database error: ', event.target.error);
    }

    // Stores
    addStore = data => {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(['stores'], 'readwrite');
            const store = transaction.objectStore('stores');
            const request = store.add(data);
            request.onsuccess = () => resolve();
            request.onerror = event => reject(event.target.error);
        });
    }

    getStores = () => {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(['stores'], 'readonly');
            const store = transaction.objectStore('stores');
            const request = store.getAll();
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    }

    // Products

    // Stock (goods)

    // Movements

}