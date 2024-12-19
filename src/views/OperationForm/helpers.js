import { validOperationType } from "../../model/constants";


const getMissingFields = formData => { // Form validation
    const {operation, products} = formData;
    const missingFields = [];
    switch(operation){
        case "MOVE_STOCK":
        case "MOVE_PACKS":
        case "BUY":
            if(!products.every(p => p.amount > 0))
                missingFields.push("product_amount_error");
            if(p.toStoreId !== p.fromStoreId)
                missingFields.push("same_store_error");
            break;
        case "SPEND":
        case "RETURN_PACKS":
            if(products.every(p => p.amount > 0))
                missingFields.push("return_amount_error");
        default:
            missingFields.push("operation_error");
    }
    return missingFields;
};

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
    switch(table){
        case "items":
            return data.map(it => ({
                ...it,
                presentations: it.productData.presentations,
                name: it.productData.name,
                toStoreId: "",
                fromStoreId: it.store_id,
                amount: ""
            }));
        case "products":
            return data.map(p => ({
                ...p,
                product_id: p.id,
                toStoreId: "",
                fromStoreId: "",
                amount: 0,
                presentation_index: 0
            }));
        default:
            return [];
    }
};

export { getMissingFields, getURLParams, getProductData };