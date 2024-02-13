import { debug, levenshteinDistance } from "../../utils";
import schema from "../schema.json";
import { testData } from "./testData";

export const isValidQuery = query => [
    "getItem",
    "getAllItems",
    "getPaginatedItems",
    "getStockOfProduct",
    "getStockInStore",
    "searchTerm"
].includes(query);

export const isValidSection = sectionName => Object.keys(schema).includes(sectionName);
// export const isValidSection = sectionName => sectionName in schema;

export default class LocalDatabase {
    constructor() {
        this.type = "testing";
        this._db = testData;
        this.onReady = [];
    }

    _performTransaction(callback) {
        debug(`DB callback stack len: ${this.onReady.length}`);
        debug(this._db);
        if(this._db) 
            callback();
        else
            this.onReady.push(callback);
    };

    addItem(data, section) {
        debug("Adding item to "+section);
        debug(data);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction( () => {
                    this._db[section].push(data);
                    resolve();
                });
            }else{
                reject("Section not valid.");
            }
        });
    }

    getItem(itemId, section) {
        debug("Geting item "+itemId+" from "+section);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const item = this._db[section].filter(it => it.id === itemId);
                    if (item) resolve(item);
                    else reject(`Item with ID ${itemId} not found`);
                });
            }else{
                reject("Section not valid.");
            }
        });
    }

    removeItem(itemId, section) {
        debug("Removing item "+itemId+" from "+section);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const index = this._db[section].findIndex(it => it.id === itemId);
                    if(index >= 0){
                        this._db[section].splice(index,1);
                        resolve();
                    }else{
                        reject(`Item with ID ${itemId} not found`);
                    }
                });
            }else{  
                reject("Section not valid.");
            }
        });
    }

    getAllItems(section) {
        debug("Get all items from "+section);
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    resolve(this._db[section]);
                });
            }else{
                reject("Section not valid.");
            }
        });
    }

    getPaginatedItems(section, page, count) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const startIndex = (page - 1) * count;
                    const endIndex = startIndex + count;
                    const sectionItems = this._db[section];
                    const paginatedItems = sectionItems.slice(startIndex, endIndex);
                    resolve(paginatedItems);
                });
            }else{
                reject("Section not valid.");
            }
        });
    }

    searchTerm(section, attr, term, thresh = 3) {
        return new Promise((resolve, reject) => {
            if(isValidSection(section)){
                this._performTransaction(() => {
                    const results = this._db[section]
                        .filter(it => levenshteinDistance(term, it[attr]) < thresh)
                        .sort((a, b) => a.similarity - b.similarity);
                    resolve(results);
                });
            }else{
                reject("Section not valid.");
            }
        });
    }

    getStockOfProduct(productId) {
        return new Promise(resolve => {
            this._performTransaction(() => {
                resolve(this._db["items"].filter(it => it.product_id === productId));
            });
            
        });
    }

    getStockInStore(storeId) {
        return new Promise(resolve => {
            this._performTransaction( () => {
                resolve(this._db["items"].filter(it => it.store_id === storeId));
            });
        });
    }
}
