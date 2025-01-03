import { validOperationType } from "../../model/constants";


const getMissingFields = (products, operation) => { // Form validation
    const missingFields = [];
    if(!products.every(p => p.amount > 0))
        missingFields.push("product_amount_error");
    switch(operation){
        case "MOVE_STOCK":
        case "MOVE_PACKS":
            if(products.some(p => p.toStoreId === p.fromStoreId || p.toStoreId === "" || p.fromStoreId === ""))
                missingFields.push("store_error");
            break;
        case "BUY":
            if(products.some(p => p.toStoreId === ""))
                missingFields.push("store_error");
            break;
        case "SPEND":
        case "RETURN_PACKS":
            break;
        default:
            missingFields.push("operation_error");
    }
    return missingFields;
};

const validateOperation = (products, operation) => {
    // Once inputs are valid, check input values with database

    const validationErrors = [];

    switch(operation){
        case "SPEND": // Must have stock
        case "MOVE_STOCK": // Must have stock, 
            if(products.some(p => p.amount > p.stock))
                validationErrors.push("stock_error");
            break;
        case "MOVE_PACKS": // Must have packs
        case "RETURN_PACKS": // Must have packs
            if(products.some(p => p.amount > p.empty_packs))
                validationErrors.push("packs_error");
            break;
        case "BUY":
            break;
        default:
            validationErrors.push("operation_error");
    }

    return validationErrors;
}

const getURLParams = searchParams => {
    const operation = searchParams.get("type");
    const itemsId = searchParams.get("items");
    const productsId = searchParams.get("products");
    const ids = itemsId ? itemsId.split("_") : productsId ? productsId.split("_") : [];
    const table = itemsId ? "items" : productsId ? "products" : "";
    return { 
        operation,
        table, 
        ids, 
        valid: validOperationType(operation) && ids.length > 0 
    };
};

const getProductData = (table, data) => {
    // This function returns the products data with the format required for each 
    // form block (in case of more than one).

    /* Required fields to make the ProductBlock component work are:
        - item_id (for items)
        - product_id
        - fromStoreId
        - toStoreId
        - fromStoreName (for items)
        - name
        - presentations
        - presentation_index
        - returnable
        - expirable
        - amount
        - min_stock
    */

    switch(table){
        case "items": // Items are already in a store
            return data.map(it => ({
                item_id: it.id,
                product_id: it.product_id,
                fromStoreId: it.store_id,
                toStoreId: "",
                fromStoreName: it.storeData.name,
                stock: it.stock,
                name: it.productData.name,
                presentations: it.productData.presentations,
                presentation_index: it.presentation_index,
                returnable: it.productData.returnable,
                expirable: it.productData.expirable,
                amount: "",
                min_stock: it.min_stock,
            }));
        case "products": // Buy new products
            return data.map(p => ({
                // item_id: it.id, // New products don't have an item
                product_id: p.id,
                fromStoreId: "",
                toStoreId: "",
                // fromStoreName: it.storeData.name, // New products don't have a store
                stock: 0,
                name: p.name,
                presentations: p.presentations,
                presentation_index: 0,
                returnable: p.returnable,
                expirable: p.expirable,
                amount: "",
                min_stock: 0
            }));
        default:
            return [];
    }
};

const getOperationData = (products, operation, observations) => ({
    type: operation,
    timestamp: Date.now(),
    items_data: products.map(p => ({
        product_id: p.product_id,
        store_from_id: p.fromStoreId,
        store_to_id: p.toStoreId,
        price: p.price,
        amount: p.amount,
        presentation_index: p.presentation_index
    })),
    observations
});

const getItemsData = (products, operation) => {
    // This function returns the items data with the format required for the database
    
    const items = products.map(p => {
        let newItemId = p.item_id;
        let newStock = 0; 
        let newEmptyPacks = 0;
        let storeId = p.fromStoreId;
        switch(operation){
            case "BUY":
                newStock = p.amount; 
                storeId = p.toStoreId;
                break;
            case "MOVE_STOCK":
                newStock = -p.amount;
                break;
            case "MOVE_PACKS":
                newEmptyPacks = -p.amount;
                break;
            case "SPEND":
                newStock = -p.amount;
                const presentation = p.presentations[p.presentation_index];
                if(p.returnable){ // Compute new empty packs
                    const currentPacks = Math.ceil(p.stock/presentation.pack_size);
                    const newPacks = Math.ceil((p.stock-p.amount)/presentation.pack_size);
                    newEmptyPacks = currentPacks - newPacks;
                }
                break;
            case "RETURN_PACKS":
                newEmptyPacks = -p.amount
                break;
            default: // Not valid operation
                console.error("Invalid operation");
                return {};
        }
        return {
            id: newItemId,
            product_id: p.product_id,
            store_id: storeId,
            stock: newStock,
            empty_packs: newEmptyPacks,
            presentation_index: p.presentation_index,
            expiration_date: p.expiration_date,
            min_stock: p.min_stock 
        };
    });

    // For the case of move stock and move packs, new items must be pushed to DB.
    // Total stock and packs in stores are computed in the db.insert method.
    if(operation === "MOVE_STOCK" || operation === "MOVE_PACKS"){
        const newItems = products.map(p => {
            return {
                id: -1, // To force new row in DB
                product_id: p.product_id,
                store_id: p.toStoreId,
                stock: operation === "MOVE_STOCK" ? p.amount : 0,
                empty_packs: operation === "MOVE_PACKS" ? p.amount : 0,
                presentation_index: p.presentation_index,
                expiration_date: p.expiration_date,
                min_stock: p.min_stock
            };
        });
        return items.concat(newItems);
    };

    return items;
}


export { 
    getMissingFields, 
    validateOperation, 
    getURLParams, 
    getProductData,
    getOperationData,
    getItemsData 
};