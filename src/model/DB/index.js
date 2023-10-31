import {
    DB_NAME,
    DB_VERSION
} from "../constants";
import { debug } from "../utils";

const schema = {
    stores: {
        options: {keyPath: 'id', autoIncrement: true}
    },
    products: {
        options: {keyPath: 'id', autoIncrement: true}
    },
    goods: {
        options: {keyPath: 'id', autoIncrement: true},
        indexes: [
            {name: 'store_id', keyPath: 'store_id', options: {unique: false}},
            {name: 'product_id', keyPath: 'product_id', options: {unique: false}}
        ]
    },
    operations: {
        options: {keyPath: 'id', autoIncrement: true},
        indexes: [
            { name: 'good_id', keyPath: 'good_id', options: { unique: false } },
            { name: 'timestamp', keyPath: 'timestamp', options: { unique: false } }
        ]
    }
};

export default class LocalDatabase {
    constructor() {
        this._db = null;
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = event => {
            this._db = event.target.result;
            Object.keys(schema).forEach( key => {
                const store = this._db.createObjectStore(key, schema[key].options);
                if(schema[key].indexes)
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
            if(this._db){
                const transaction = this._db.transaction([section], 'readwrite');
                const store = transaction.objectStore(section);
                const request = store.add(data);
                request.onsuccess = () => resolve();
                request.onerror = event => reject(event.target.error);
            }else{
                reject('DB not initialized.');
            }
        });
    }

    getItems = section => {
        return new Promise((resolve, reject) => {
            if(this._db){
                const transaction = this._db.transaction([section], 'readonly');
                const store = transaction.objectStore(section);
                const request = store.getAll();
                request.onsuccess = event => resolve(event.target.result);
                request.onerror = event => reject(event.target.error);
            }else{
                reject('DB not initialized');
            }
        });
    }

    // Queries for goods
    getStockOfProduct = goodId => {
        return new Promise((resolve, reject) => {
            const transaction = this._db.transaction(['goods'], 'readonly');
            const store = transaction.objectStore('goods');
            const index = store.index('product_id');
            const request = index.getAll(IDBKeyRange.only(goodId));
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    };

    getOperationsForGood = goodId => {
        return new Promise((resolve, reject) => {
          const transaction = this._db.transaction(['operations'], 'readonly');
          const store = transaction.objectStore('operations');
          const index = store.index('good_id');
          const request = index.getAll(IDBKeyRange.only(goodId));
          request.onsuccess = event => resolve(event.target.result);
          request.onerror = event => reject(event.target.error);
        });
    };
}