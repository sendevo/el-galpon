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
    |   - item_id (for items)
        - product_id
        - name
        - presentations
        - presentation_index
        - returnable
        - expirable
        - expiration_date
        - toStoreId
        - fromStoreId
        - amount
        - min_stock
    */

    switch(table){
        case "items": // Items are already in a store
            return data.map(it => ({
                item_id: it.id,
                product_id: it.product_id,
                fromStoreId: it.store_id,
                fromStoreName: it.storeData.name,
                toStoreId: "",
                name: it.productData.name,
                min_stock: it.min_stock,
                presentations: it.productData.presentations,
                presentation_index: it.presentation_index,
                returnable: it.productData.returnable,
                expirable: it.productData.expirable,
                amount: ""
            }));
        case "products": // Buy new products
            return data.map(p => ({
                product_id: p.id,
                fromStoreId: "",
                toStoreId: "",
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

export { getMissingFields, validateOperation, getURLParams, getProductData };