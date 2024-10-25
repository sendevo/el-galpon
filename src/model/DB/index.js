import { OPERATION_TYPES, ERROR_CODES } from "../constants";
import { 
    debug, 
    levenshteinDistance, 
    queryString2Filters,
    compare, 
    generateUUID
} from "../utils";
import moment from "moment";
import i18n from "i18next";
import { MOMENT_LOCALE } from "../constants";
import schemas from "./schemas.json";
import migrateDB from "./migrations";
import testData from "./testData";

const DB_NAME = "elgalponDB"; // Used for indexedDB
const DB_MODE = "test";
const DB_VERSION = schemas.length - 1; // Current version
const DB_SCHEMA = schemas[DB_VERSION];
const tables = Object.keys(DB_SCHEMA);

export const isValidRowData = (row,table) => DB_SCHEMA[table].attributes.every(attr => attr in row);
export const isValidTable = tableName => tableName in DB_SCHEMA;

const ERROR_TYPES = ERROR_CODES.DB;

export default class LocalDatabase {
    constructor(onReady) {
        // Get data from localStorage
        // Check if migration is needed
        // If needed, migrate data
        // Else load all database to memory
        this._db = {};
        const version = localStorage.getItem("version");
        if(version){ // With data
            const versionCode = parseInt(version);
            if(versionCode !== DB_VERSION){ // Migration required -> get old data, migrate, save
                debug("Database version changed, migrating data...");
                const oldSchema = schemas[versionCode];
                Object.keys(oldSchema).forEach(table => {
                    const data = localStorage.getItem(table);
                    this._db[table] = data ? JSON.parse(data) : [];
                });
                migrateDB(versionCode, DB_VERSION, this._db)
                    .then(newData => {
                        this._db = newData;
                        localStorage.clear();
                        localStorage.setItem("version", JSON.stringify(DB_VERSION));
                        tables.forEach(table => {
                            localStorage.setItem(table, JSON.stringify(this._db[table]));
                        });
                        debug("Migration completed.");
                        onReady(this);
                    })
                    .catch(console.error);
            }else{ // Load data 
                debug("Loading data...");
                const locale = localStorage.getItem("locale") || "es";
                this.updateLocale(locale);
                tables.forEach(table => {
                    const data = localStorage.getItem(table);
                    this._db[table] = data ? JSON.parse(data) : [];
                });
                debug("Data loaded.");
                onReady(this);
            }
        }else{ // Empty database
            if(DB_MODE === "test"){ // Load test data
                this._db = testData;
                localStorage.clear();
                localStorage.setItem("version", JSON.stringify(DB_VERSION));
                tables.forEach(table => {
                    localStorage.setItem(table, JSON.stringify(this._db[table]));
                });
                debug("Test data loaded.");
                onReady(this);
            }else{
                debug("Empty database, creating tables...");
                tables.forEach(table => {
                    this._db[table] = [];
                    localStorage.setItem(table, "");
                });
            }
            onReady(this);
        }
    }

    updateLocale(locale){
        moment.updateLocale(locale, MOMENT_LOCALE[locale]);
        i18n.changeLanguage(locale);
        localStorage.setItem("locale", locale);
    }

    insert(table, data) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                const index = this._db[table].findIndex(r => r.id === data.id);
                if(index < 0){ // If not found, its a new row
                    debug("Adding item to "+table);
                    data.id = generateUUID();
                    this._db[table].push(data);
                }else{ // If found, update row data
                    debug("Editing item in "+table);
                    this._db[table][index] = data;
                }
                localStorage.setItem(table, JSON.stringify(this._db[table]));
                debug(data);
                resolve(data.id);
            }else{
                reject({message:"Table not valid.", type: ERROR_TYPES.INVALID_TABLE});
            }
        });
    }

    query(table, rowIds = [], queryString = "", page = null, count = null) {
        // queryString: key:operator:value, example: "stock:gt:10"
        return new Promise((resolve, reject) => {
            if(!isValidTable(table)){
                reject({message:"Table not valid.", type: ERROR_TYPES.INVALID_TABLE});
                return;
            }
            const filters = queryString ? queryString2Filters(queryString) : []; // [{key, operator, value}]
            
            // Filter by properties
            let rows = this._db[table].filter(it => {
                const condition = filters.every(filter => {
                    const value = it[filter.key];
                    return compare(value, filter.value, filter.operator);
                }) && (rowIds.length === 0 || rowIds.includes(it.id));
                return condition;
            });
            if(table === "items"){ // For items, add product and store data and compute amount of stock
                for(let index = 0; index < rows.length; index++){
                    rows[index].productData = this._db.products.find(prod => prod.id === rows[index].product_id);
                    rows[index].storeData = this._db.stores.find(store => store.id === rows[index].store_id);
                }
            }
            if(page && count){
                const startIndex = (page - 1) * count;
                const endIndex = startIndex + count;
                const paginatedItems = rows.slice(startIndex, endIndex);
                resolve(paginatedItems);
            }
            resolve(rows);
        });
    }

    delete(table, rowIds = []) {
        return new Promise((resolve, reject) => {
            if(!isValidTable(table)){
                reject({message:"Table not valid.", type:ERROR_TYPES.INVALID_TABLE});
                return;
            }
            // If table is "stores" or "products", check that there are not rows in table "items" that has this store or product
            const queryData = {
                stores: {
                    message: "Store has items",
                    key: "store_id"
                },
                products: {
                    message: "There items with this product",
                    key: "product_id"
                }
            }
            if(Object.keys(queryData).includes(table)){
                const itemsWithStore = this._db.items.filter(it => rowIds.includes(it[queryData[table].key]));
                if(itemsWithStore.length > 0){
                    reject({message: queryData[table].message, items: itemsWithStore, type: ERROR_TYPES.WITH_ITEMS});
                    return;
                }
            }
            const itemsLeft =  this._db[table].filter(it => !rowIds.includes(it.id));
            this._db[table] = itemsLeft;
            localStorage.setItem(table, JSON.stringify(itemsLeft));
            resolve();
        });
    }

    searchTerm(table, attr, term, thresh = 3) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                const results = this._db[table]
                    .filter(it => levenshteinDistance(term, it[attr]) < thresh)
                    .sort((a, b) => a.similarity - b.similarity);
                resolve(results);
            }else{
                reject({message:"Table not valid.", type: ERROR_TYPES.INVALID_TABLE});
            }
        });
    }

    _storeHasStock(storeId, productId){

    }

    _storeHasPacks(storeId, productId){

    }

    buyStock(itemsData) {
        // http://localhost:5173/operation-form?type=BUY&products=0394-jfuqgtdh4-23hj2h4
        return new Promise((resolve, reject) => {
            const job = [];
            itemsData.forEach(item => {
                const amt = parseInt(item.amount);
                const operation = {
                    timestamp: Date.now(),
                    type: OPERATION_TYPES.BUY,
                    item_id: item.id,
                    store_from_id: item.currentStoreId || null,
                    store_to_id: item.toStoreId || null,
                    price: 0,
                    stock_amount: amt,
                    pack_amount: item.returnable ? amt : 0
                };
                job.push(this.insert("operations", operation));
            });
            Promise.all(job)
                .then(ids => {
                    resolve(ids);
                })
                .catch(reject);
        });
    }

    spendStock(itemsData) {
        return new Promise((resolve, reject) => {
            console.log("Spending stock...");
            console.log(itemsData);
        });
    }

    moveStock(itemsData) {
        return new Promise((resolve, reject) => {

        });
    }

    movePacks(itemsData) {
        return new Promise((resolve, reject) => {

        });
    }

    returnPacks(items, origins, amount) {
        return new Promise((resolve, reject) => {

        });
    }

    handleOperation(operation_key, items){
        const operation = OPERATION_TYPES[operation_key];
        switch(operation){
            case OPERATION_TYPES.BUY:
                return this.buyStock(items);
            case OPERATION_TYPES.SPEND:
                return this.spendStock(items);
            case OPERATION_TYPES.MOVE_STOCK:
                return this.moveStock(items);
            case OPERATION_TYPES.MOVE_PACKS:
                return this.movePacks(items);
            case OPERATION_TYPES.RETURN_PACKS:
                return this.returnPacks(items);
            default:
                return new Promise((_, reject) => {
                    reject({message:"Operation not valid.", type: ERROR_TYPES.UNKNOWN_OPERATION});
                });
        }
    }
}