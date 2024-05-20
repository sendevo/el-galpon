import { OPERATION_TYPES } from "../../constants";
import { debug, levenshteinDistance } from "../../utils";
import schema from "../schema.json";
import { testData } from "./testData";

export const isValidQuery = query => [
    "query",
    "getPaginatedRows",
    "searchTerm",
    "getStockOfProduct",
    "getStockInStore",
    "moveStock"
].includes(query);

export const isValidTable = sectionName => Object.keys(schema).includes(sectionName);
// export const isValidTable = sectionName => sectionName in schema;

export default class LocalDatabase {
    constructor() {
        this.type = "testing";
        this._db = testData;
        this.lastId = 0; // First id will be 1
    }

    getNewId() {
        this.lastId++;
        return this.lastId;
    }

    addRow(data, table) {
        debug("Adding item to "+table);
        debug(data);
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                const index = this._db[table].findIndex(it => it.id === data.id);
                if(index < 0){ // If not found new item  
                    data.id = this.getNewId();
                    this._db[table].push(data);
                }else{ // If found, update item
                    this._db[table][index] = data;
                }
                resolve(data.id);
            }else{
                reject({message:"Table not valid."});
            }
        });
    }

    query(table, rowIds = [], filters = {}) {
        return new Promise((resolve, reject) => {
            const rows = this._db[table].filter(it => {
                const condition = Object.keys(filters).reduce((acc, current) => {
                    return acc && current in it && it[current] === filters[current];
                }, rowIds.length > 0 ? rowIds.includes(it.id) : true);
                return condition;
            });
            if(rows.length > 0){
                if(table === "items"){ // For items, add product and store data
                    for(let index = 0; index < rows.length; index++){
                        rows[index].productData = this._db.products.find(prod => prod.id === rows[index].product_id);
                        rows[index].storeData = this._db.stores.find(store => store.id === rows[index].store_id);
                    }
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

    getPaginatedRows(table, page, count) {
        return new Promise((resolve, reject) => {
            if(isValidTable(table)){
                const startIndex = (page - 1) * count;
                const endIndex = startIndex + count;
                const sectionItems = this._db[table];
                const paginatedItems = sectionItems.slice(startIndex, endIndex);
                resolve(paginatedItems);
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
                this.addRow(itemData, "items")
                    .then(() => {
                        this.addRow(operationData, "operations")
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
                this.addRow(newItemData, "items")
                    .then(() => { // Update amount of remaining
                        itemData[type] -= amount;
                        this.addRow(itemData, "items")
                            .then(() => {
                                this.addRow(operationData, "operations")
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
            this.addRow(itemData, "items")
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
                    this.addRow(operationData, "operations")
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

            this.addRow(stockData, "items")
                .then(() => { // Register operation
                    this.addRow(operationData, "operations")
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
