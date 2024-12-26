import { ERROR_CODES } from "../constants";
import { 
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

export const DB_TEST_MODE = true;
const DB_NAME = "elgalponDB"; // Used for indexedDB
const DB_VERSION = schemas.length - 1; // Current version
const DB_SCHEMA = schemas[DB_VERSION];
const tables = Object.keys(DB_SCHEMA);

export const isValidRowData = (row,table) => DB_SCHEMA[table].attributes.every(attr => attr in row);
export const isValidTable = tableName => tableName in DB_SCHEMA;

const ERROR_TYPES = ERROR_CODES.DB;

export default class LocalDatabase {
    constructor() {
        this._db = null;
    }

    init(){
        return new Promise((resolve, reject) => {
            // Get data from localStorage
            // Check if migration is needed
            // If needed, migrate data
            // Else load all database to memory
            this._db = {};
            const version = localStorage.getItem("version");
            if(version){ // With data
                const versionCode = parseInt(version);
                if(versionCode !== DB_VERSION){ // Migration required -> get old data, migrate, save
                    console.log("Database version changed, migrating data...");
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
                            console.log("Migration completed.");
                            resolve();
                        })
                        .catch(console.error);
                }else{ // Load data 
                    console.log("Loading data...");
                    const locale = localStorage.getItem("locale") || "es";
                    this.updateLocale(locale);
                    tables.forEach(table => {
                        const data = localStorage.getItem(table);
                        this._db[table] = data ? JSON.parse(data) : [];
                    });
                    console.log("Data loaded.");
                    resolve();
                }
            }else{ // Clear database
                console.log("Empty database, creating tables...");
                localStorage.setItem("version", JSON.stringify(DB_VERSION));
                tables.forEach(table => {
                    this._db[table] = [];
                    localStorage.setItem(table, "");
                });
                resolve();
            }
        });
    }

    loadTestData(){
        return new Promise((resolve, reject) => {
            this._db = testData;
            localStorage.clear();
            localStorage.setItem("version", JSON.stringify(DB_VERSION));
            tables.forEach(table => {
                localStorage.setItem(table, JSON.stringify(this._db[table]));
            });
            console.log("Test data loaded.");
            resolve();
        });
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
                    console.log("Adding item to "+table);
                    data.id = generateUUID();
                    this._db[table].push(data);
                }else{ // If found, update row data
                    console.log("Editing item in "+table);
                    this._db[table][index] = data;
                }
                localStorage.setItem(table, JSON.stringify(this._db[table]));
                console.log(data);
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
                    const itemAttrValue = it[filter.key];
                    return compare(itemAttrValue, filter.value, filter.operator);
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
}