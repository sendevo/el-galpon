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
        case "items":
            return data.map(it => ({
                ...it, // {id, product_id, store_id, stock, empty_packs, presentation_index, expiration_date, min_stock}
                presentations: it.productData.presentations,
                returnable: it.productData.returnable,
                expirable: it.productData.expirable,
                name: it.productData.name,
                toStoreId: "",
                fromStoreId: it.store_id,
                fromStoreName: it.storeData.name,
                amount: ""
            }));
        case "products":
            return data.map(p => ({
                ...p, // {id, name, presentations, returnable, expirable}
                product_id: p.id,
                expiration_date: Date.now(),
                toStoreId: "",
                fromStoreId: "",
                amount: "",
                presentation_index: 0,
                min_stock: 0
            }));
        default:
            return [];
    }
};

export { getMissingFields, validateOperation, getURLParams, getProductData };