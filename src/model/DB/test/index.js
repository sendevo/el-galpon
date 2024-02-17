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
    }

    addItem(data, section) {
        debug("Adding item to "+section);
        debug(data);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                const index = this._db[section].findIndex(it => it.id === data.id);
                if(index < 0)
                    this._db[section].push(data);
                else
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

            const stockData = {
                product_id: productId,
                store_id: storeId,
                stock: amount,
                packs: 0,
                expiration_date: expirationDate
            };
            this.addItem(stockData, "items")
                .then(() => {
                    // Register operation
                    const operationData = {
                        timestamp: Date.now(),
                        type: OPERATION_TYPES.BUY,
                        item_id: item.id,
                        store_from_id: currentStoreId,
                        store_to_id: toStoreId,
                        price: price,
                        stock_amount: stockAmount,
                        pack_amount: packAmount 
                    };

                    this.addItem(operationData, "operations")
                        .then(resolve)
                        .catch(reject);
                })
                .catch(reject);
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

