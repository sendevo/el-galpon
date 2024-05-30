import { OPERATION_TYPES } from "../constants";
import { 
    debug, 
    levenshteinDistance, 
    queryString2Filters,
    compare, 
    generateUUID
} from "../utils";
import { 
    DB_SCHEMA,
    DB_MODE, 
    DB_VERSION, 
    getSchemaVersion 
} from "../constants";
import migrateDB from "./migrations";
import { testData } from "./testData";

const tables = Object.keys(DB_SCHEMA);
//export const isValidTable = tableName => tables.includes(tableName);
export const isValidTable = tableName => tableName in DB_SCHEMA;


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
                const oldSchema = getSchemaVersion(versionCode);
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
                        onReady(this)
                    })
                    .catch(console.error);
            }else{ // Load data 
                debug("Loading data...");
                tables.forEach(table => {
                    const data = localStorage.getItem(table);
                    this._db[table] = data ? JSON.parse(data) : [];
                });
                debug("Data loaded.");
                onReady(this);
            }
        }else{ // Empty database
            if(DB_MODE === "test"){
                debug("Loading test data...");
                Object.keys(testData).forEach(table => {
                    if(table != "version"){
                        const rows = testData[table];
                        this._db[table] = rows;
                        localStorage.setItem(table, JSON.stringify(rows));
                    }
                });
                localStorage.setItem("version", JSON.stringify(DB_VERSION));
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

    insert(data, table) {
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
                reject({message:"Table not valid."});
            }
        });
    }

    query(table, rowIds = [], queryString = "", page = null, count = null) {
        // queryString: key:operator:value, example: "stock:gt:10"
        return new Promise((resolve, reject) => {
            if(!isValidTable(table)){
                reject({message:"Table not valid."});
                return;
            }
            const filters = queryString ? queryString2Filters(queryString) : []; // [{key, operator, value}]
            // totalAmount is computed from product data, so filter is applied later
            let filterByTotalAmount = {apply: false, value: 0, operator: ""}; 
            // Filter by other properties
            let rows = this._db[table].filter(it => {
                const condition = filters.every(filter => {
                    if(table === "items" && filter.key === "totalAmount"){ 
                        filterByTotalAmount = {
                            apply: true,
                            value: parseInt(filter.value),
                            operator: filter.operator
                        };
                        return true;
                    }else{
                        const value = it[filter.key];
                        return compare(value, filter.value, filter.operator);
                    }
                }) && (rowIds.length === 0 || rowIds.includes(it.id));
                return condition;
            });
            if(rows.length > 0){
                if(table === "items"){ // For items, add product and store data and compute amount of stock
                    for(let index = 0; index < rows.length; index++){
                        rows[index].productData = this._db.products.find(prod => prod.id === rows[index].product_id);
                        rows[index].storeData = this._db.stores.find(store => store.id === rows[index].store_id);
                        rows[index].totalAmount = rows[index]?.stock * rows[index].productData?.pack_size;
                    }
                    if(filterByTotalAmount.apply){ // Apply filter by totalAmount
                        const { value, operator } = filterByTotalAmount;
                        rows = rows.filter(it => compare(it.totalAmount, value, operator));
                    }
                }
                if(page && count){
                    const startIndex = (page - 1) * count;
                    const endIndex = startIndex + count;
                    const paginatedItems = rows.slice(startIndex, endIndex);
                    resolve(paginatedItems);
                }
                resolve(rows);
            }else{
                reject({message:"No item was found with given query"});
            }
        });
    }

    removeRow(rowId, table) {
        debug("Removing item "+rowId+" from "+table);
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                const index = this._db[table].findIndex(it => it.id === rowId);
                if(index >= 0){
                    this._db[table].splice(index,1);
                    resolve();
                }else{
                    reject({message:`Item with ID ${rowId} not found`});
                }
            }else{  
                reject({message:"Table not valid."});
            }
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
                reject({message:"Table not valid."});
            }
        });
    }


    // Business model specific functions
    _moveStockOrPacks(itemId, amount, type, toStoreId) { // Move stock or empty packs between stores
        return new Promise((resolve, reject) => {
            // Validation
            
            const itemIndex = this._db.items.findIndex(it => it.id === itemId);
            if(itemIndex < 0){
                reject({message: "Item not found"});
                return;
            }

            if(toStoreId){
                const storeIndex = this._db.stores.findIndex(it => it.id === toStoreId);
                if(storeIndex < 0){
                    reject({message: "Store not found"});
                    return;
                }
            }

            if(amount <= 0){
                reject({message: "Cannot move negative amount"});
                return;
            }

            if(type !== "stock" && type !== "packs"){
                reject({message: "Unknown operation type"});
                return;
            }

            const itemData = this._db.items[itemIndex];    
            if(amount > itemData[type]){ // Not allowed
                reject({message: "Cannot move greater amount than current stock."});
                return;
            }

            const operationData = {
                timestamp: Date.now(),
                type: type === "stock" ? OPERATION_TYPES.MOVE_STOCK : OPERATION_TYPES.MOVE_PACKS,
                item_id: itemId,
                store_from_id: itemData.store_id,
                store_to_id: toStoreId,
                price: 0,
                stock_amount: type === "stock" ? amount : null,
                pack_amount: type === "packs" ? amount : null
            };

            if(amount === itemData[type]){ // Move all stock to another store
                itemData.store_id = toStoreId;
                this.insert(itemData, "items")
                    .then(() => {
                        this.insert(operationData, "operations")
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
                return;
            } 
            
            if(amount < itemData[type]){ // Create new item in another store
                const newItemData = {
                    ...itemData,
                    id: null,
                    store_id: toStoreId,
                    [type]: amount
                };
                this.insert(newItemData, "items")
                    .then(() => { // Update amount of remaining
                        itemData[type] -= amount;
                        this.insert(itemData, "items")
                            .then(() => {
                                this.insert(operationData, "operations")
                                    .then(resolve)
                                    .catch(reject);
                            })
                            .catch(reject);
                        return;
                    })
                    .catch(reject);
            }
        });
    }

    _reduceStockOrPacks(itemId, amount, type) { // Update amount but not store
        return new Promise((resolve, reject) => {
            const itemIndex = this._db.items.findIndex(it => it.id === itemId);
            if(itemIndex < 0){
                reject({message: "Item not found"});
                return;
            }

            if(amount <= 0){
                reject({message: "Cannot spend or return negative amount"});
                return;
            }

            if(type !== "stock" && type !== "packs"){
                reject({message: "Unknown operation type"});
                return;
            }

            // Update amount of item's stock or packs
            const itemData = this._db.items[itemIndex];
            if(amount > itemData[type]){ // Not allowed
                reject({message: "Cannot spend greater amount than current."});
                return;
            }
            itemData[type] -= amount;

            // If returnable product, update empty packs number
            const productIndex = this._db.products.findIndex(prod => prod.it === itemData.product_id);
            if(productIndex < 0){
                reject({message: "Cannot find item product type"});
                return;
            }
            const productData = this._db.products[productIndex];
            if(type === "stock" && productData.returnable)
                itemData.packs += amount;

            // Update database
            this.insert(itemData, "items")
                .then(() => {
                    const operationData = {
                        timestamp: Date.now(),
                        type: OPERATION_TYPES.RETURN_PACKS,
                        item_id: itemId,
                        store_from_id: itemData.store_id,
                        price: 0,
                        stock_amount: type === "stock" ? amount : null,
                        pack_amount: type === "packs" ? amount : null
                    };
                    this.insert(operationData, "operations")
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    // Operations for stored items (has storeId)
    buyStock(productId, amount, storeId, price, expirationDate) {
        return new Promise((resolve, reject) => {
            
            // Validation
            const productIndex = this._db.products.findIndex(it => it.id === productId);
            if(productIndex < 0){
                reject({message: "Product not found"});
                return;
            }

            if(amount <= 0){
                reject({message: "Cannot buy negative amount"});
                return;
            }

            const storeIndex = this._db.stores.findIndex(it => it.id === storeId);
            if(storeIndex < 0){
                reject({message: "Store not found"});
                return;
            }

            // New rows
            const stockData = {
                product_id: productId,
                store_id: storeId,
                stock: amount,
                packs: 0,
                expiration_date: expirationDate
            };
            const operationData = {
                timestamp: Date.now(),
                type: OPERATION_TYPES.BUY,
                item_id: item.id,
                store_to_id: storeId,
                price: price,
                stock_amount: stockAmount,
                pack_amount: packAmount 
            };

            this.insert(stockData, "items")
                .then(() => { // Register operation
                    this.insert(operationData, "operations")
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    moveStock(itemId, amount, toStoreId) {
        return this._moveStockOrPacks(itemId, amount, "stock", toStoreId);
    }

    spendStock(itemId, amount) {
        return this._reduceStockOrPacks(itemId, amount, "stock");
    }

    movePacks(itemId ,amount, toStoreId) {
        return this._moveStockOrPacks(itemId, amount, "packs", toStoreId);
    }

    returnPacks(itemId, amount) {
        return this._reduceStockOrPacks(itemId, amount, "packs");
    }
}
