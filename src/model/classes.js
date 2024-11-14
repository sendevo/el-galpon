import { generateUUID } from "./utils";
import { OPERATION_TYPES } from "./constants";


class Presentation {
    constructor(params) {
        Object.assign(this, params);
    }

    static create(params = {}) {
        return new Presentation({
            pack_size: params.pack_size || 0,
            unit: params.unit || '',
            bulk: params.bulk || false
        });
    }
};

class Contact {
    constructor(params) {
        Object.assign(this, params);
    }

    static create(params = {}) {
        return new Contact({
            name: params.name || '',
            phone: params.phone || '',
            address: params.address || ''
        });
    }

    print() {  
        return `${this.name} - ${this.phone} - ${this.address}`;
    }
}

class Store {
    constructor(params) {
        Object.assign(this, params);
    }

    static create(params = {}) {
        return new Store({
            id: params.id || generateUUID(),
            name: params.name || '',
            lat: params.lat || 0,
            lng: params.lon || 0,
            contact: params.contact || Contact.create(),
            created: params.created || Date.now(),
            modified: params.modified || Date.now()
        });
    }

    update(params) {
        Object.assign(this, params);
        this.modified = Date.now();
    }
};

class Product {
    constructor(params) {
        Object.assign(this, params);
    }

    static create(params = {}) {
        return new Product({
            id: params.id || generateUUID(),
            name: params.name || '',
            brand: params.brand || '',
            comments: params.comments || '',
            categories: params.categories || [],
            presentations: params.presentations || [Presentation.create()],
            expirable: params.expirable || false,
            returnable: params.returnable || false,
            price: params.price || 0,
            sku: params.sku || '',
            created: params.created || Date.now(),
            modified: params.modified || Date.now()
        });
    }

    addCategory(category) {
        this.categories.push(category);
    }

    addPresentation(presentation) {
        this.presentations.push(presentation);
    }

    removeCategory(category) {
        this.categories = this.categories.filter(c => c !== category);
    }

    removePresentation(presentationIndex) {
        this.presentations.splice(presentationIndex, 1);
    }

    update(params) {
        Object.assign(this, params);
        this.modified = Date.now();
    }

    printPresentations() {
        return this.presentations.map(p => `${p.pack_size || ''} ${p.unit}`).join(', ');
    }
};

class Stock {
    constructor(params) {
        Object.assign(this, params);
    }

    static create(params = {}) {
        return new Stock({
            id: params.id || generateUUID(),
            product: params.product || Product.create(),
            presentationIndex: params.presentationIndex || 0,
            store: params.store || Store.create(),
            stock: params.stock || 0,
            packs: params.packs || 0,
            expirationDate: params.expirationDate || null,
            created: params.created || Date.now(),
            modified: params.modified || Date.now()
        });
    }

    update(params) {
        Object.assign(this, params);
        this.modified = Date.now();
    }

    performOperation(operation) {
        switch (operation.type) {
            case OPERATION_TYPES.BUY:
                break;
            default: 
                break;
        }
    }
};

class Operation { // Represents a movement of stock between stores
    constructor(params) {
        Object.assign(this, params);
    }

    static create(params = {}) {
        return new Operation({
            id: params.id || generateUUID(),
            type: params.type || OPERATION_TYPES.UNDEFINED,
            stock: [],
            storeFrom: params.storeFrom || Store.create(),
            storeTo: params.storeTo || Store.create(),
            date: params.date || Date.now()
        });
    }

    addStock(stock) {
        this.stock.push(stock);
    }
};



/* Example of usage:
import { Presentation, Contact, Store, Product, Stock, Operation } from "./model/classes";
import { OPERATION_TYPES } from "./model/constants";


const contact = new Contact(
    { 
        name: 'Contact', 
        phone: '1234', 
        address: 'Address' 
    }
);

const store = new Store(
    { 
        name: 'Store', 
        lat: 0, lon: 0, 
        contact 
    }
);

const presentation = new Presentation(
    { 
        pack_size: 1, 
        unit: 'Unit', 
        bulk: false 
    }
);

const product = new Product(
    { 
        name: 'Product', 
        brand: 'Brand', 
        comments: 'Comments', 
        categories: ['Category'], 
        presentations: [presentation], 
        expirable: false, 
        returnable: false, 
        price: 0, 
        sku: 'SKU' 
    }
);

const stock = new Stock(
    { 
        product, 
        presentationIndex: 0, 
        store, 
        stock: 0, 
        packs: 0, 
        expirationDate: null 
    }
);

const operation = new Operation(
        { 
            type: OPERATION_TYPES.BUY, 
            stock: [stock],
            storeFrom: store,
            storeTo: store
        }
    );

stock.performOperation(operation);
*/

export {
    Presentation,
    Contact,
    Store,
    Product,
    Stock,
    Operation
};