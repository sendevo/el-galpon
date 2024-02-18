import { OPERATION_TYPES } from "../../constants";
import { debug, levenshteinDistance } from "../../utils";
import schema from "../schema.json";
import { testData } from "./testData";

export const isValidQuery = query => [
    "getItem",
    "getAllItems",
    "getPaginatedItems",
    "searchTerm",
    "getStockOfProduct",
    "getStockInStore",
    "moveStock"
].includes(query);

export const isValidSection = sectionName => Object.keys(schema).includes(sectionName);
// export const isValidSection = sectionName => sectionName in schema;

export default class LocalDatabase {
    constructor() {
        this.type = "testing";
        this._db = testData;
        this.lastId = 0;
    }

    getNewId() {
        return this.lastId++;
    }

    addItem(data, section) {
        debug("Adding item to "+section);
        debug(data);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                const index = this._db[section].findIndex(it => it.id === data.id);
                if(index < 0){
                    data.id = this.getNewId();
                    this._db[section].push(data);
                }else
                    this._db[section][index] = data;
                resolve();
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    getItem(itemId, section) {
        debug("Geting item "+itemId+" from "+section);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                const item = this._db[section].filter(it => it.id === itemId);
                if(item.length === 1)
                    resolve(item[0]);
                else 
                    reject({message:`Item with ID ${itemId} not found`});
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    removeItem(itemId, section) {
        debug("Removing item "+itemId+" from "+section);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                const index = this._db[section].findIndex(it => it.id === itemId);
                if(index >= 0){
                    this._db[section].splice(index,1);
                    resolve();
                }else{
                    reject({message:`Item with ID ${itemId} not found`});
                }
            }else{  
                reject({message:"Section not valid."});
            }
        });
    }

    getAllItems(section) {
        debug("Get all items from "+section);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                resolve(this._db[section]);
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    getPaginatedItems(section, page, count) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                const startIndex = (page - 1) * count;
                const endIndex = startIndex + count;
                const sectionItems = this._db[section];
                const paginatedItems = sectionItems.slice(startIndex, endIndex);
                resolve(paginatedItems);
            }else{
                reject({message:"Section not valid."});
            }
        });
    }

    searchTerm(section, attr, term, thresh = 3) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                const results = this._db[section]
                    .filter(it => levenshteinDistance(term, it[attr]) < thresh)
                    .sort((a, b) => a.similarity - b.similarity);
                resolve(results);
            }else{
                reject({message:"Section not valid."});
            }
        });
    }


    // Business model specific functions

    getStockOfProduct(productId) {
        return new Promise(resolve => {
            const data = this._db.items
                .reduce((acc, current) => {
                    if(current.product_id === productId){
                        const sIndex = this._db.stores.findIndex(store => store.id === current.store_id);
                        acc.push({
                            ...current,
                            storeData: this._db.stores[sIndex]
                        });
                    }
                    return acc;
                },[]);

            resolve(data || []);
        });
    }

    getStockInStore(storeId) {
        return new Promise(resolve => { 
            const data = this._db.items
                .reduce((acc, current) => {
                    if(current.store_id === storeId){
                        const pIndex = this._db.products.findIndex(prod => prod.id === current.product_id);
                        acc.push({
                            ...current,
                            productData: this._db.products[pIndex]
                        });
                    }
                    return acc;
                },[]);
            resolve(data || []);
        });
    }

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

            this.addItem(stockData, "items")
                .then(() => { // Register operation
                    this.addItem(operationData, "operations")
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

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
                type: OPERATION_TYPES.MOVE,
                item_id: itemId,
                store_from_id: itemData.store_id,
                store_to_id: toStoreId,
                price: 0,
                stock_amount: type === "stock" ? amount : null,
                pack_amount: type === "packs" ? amount : null
            };

            if(amount === itemData[type]){ // Move all stock to another store
                itemData.store_id = toStoreId;
                this.addItem(itemData, "items")
                    .then(() => {
                        this.addItem(operationData, "operations")
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
                this.addItem(newItemData, "items")
                    .then(() => { // Update amount of remaining
                        itemData[type] -= amount;
                        this.addItem(itemData, "items")
                            .then(() => {
                                this.addItem(operationData, "operations")
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
            this.addItem(itemData, "items")
                .then(() => {
                    const operationData = {
                        timestamp: Date.now(),
                        type: OPERATION_TYPES.RETURN,
                        item_id: itemId,
                        store_from_id: itemData.store_id,
                        price: 0,
                        stock_amount: type === "stock" ? amount : null,
                        pack_amount: type === "packs" ? amount : null
                    };
                    this.addItem(operationData, "operations")
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    moveStock(itemId, amount, toStoreId) {
        return this._moveStockOrPacks(itemId, amount, "stock", toStoreId);
    }

    movePacks(itemId ,amount, toStoreId) {
        return this._moveStockOrPacks(itemId, amount, "packs", toStoreId);
    }

    spendStock(itemId, amount) {
        return this._reduceStockOrPacks(itemId, amount, "stock");
    }

    returnPacks(itemId, amount) {
        return this._reduceStockOrPacks(itemId, amount, "packs");
    }
}
