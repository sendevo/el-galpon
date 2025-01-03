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

const getProductData = (table,data) => {
    // This function returns the products data required for each 
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
    id: generateUUID(),
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
    const items = products.map(p => {
        let newStock = p.stock; 
        let newEmptyPacks = p.empty_packs;
        switch(operation){
            case "RETURN_PACKS":
                newEmptyPacks = p.empty_packs - p.amount
                break;
            case "BUY":
                newStock = p.stock + p.amount; 
                break;
            case "SPEND":
                newStock = p.stock - p.amount;
                const presentation = p.presentations[p.presentation_index];
                if(presentation.bulk){ // Compute new empty packs
                    newEmptyPacks = p.empty_packs + Math.ceil(p.stock/presentation.pack_size) - Math.ceil(newStock/presentation.pack_size);                    
                }
                break;
            default: // For other operations do not update item
                return{ 
                    id: p.item_id,
                    product_id: p.product_id,
                    store_id: p.toStoreId,
                    stock: p.stock,
                    empty_packs: p.empty_packs,
                    presentation_index: p.presentation_index,
                    expiration_date: p.expiration_date,
                    min_stock: p.min_stock         
                }
        }
    
        return {
            id: operation === "BUY" ? generateUUID() : p.item_id,
            product_id: p.product_id,
            store_id: operation === "SPEND" || operation === "RETURN_PACKS" ? null : p.toStoreId,
            stock: newStock,
            empty_packs: newEmptyPacks,
            presentation_index: p.presentation_index,
            expiration_date: p.expiration_date,
            min_stock: p.min_stock 
        };
    });

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