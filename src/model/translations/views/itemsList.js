import { UNITS_ABBRS } from "../../constants";

const itemList = {
    en: {
        title: "Items",
        returns: "Returns",
        product: "Product",
        presentation: "Presentation",
        location: "Location",
        stock: "Stock",
        emptyList: "Items list is empty",
        empty_packs: "Empty packs",
        store_id: "Location",
        product_id: "Product",
        expiration_date: "Expiration",
        buy: "Buy other products",
        export: "Export data",
        operationError: "Operation not allowed",
        notAvailable: "Not available function",
        invalidParams: "Query returned no results",
        bulk: "bulk",
        ...UNITS_ABBRS.en
    },
    es: {
        title: "Insumos",
        returns: "Devoluciones",
        product: "Producto",
        presentation: "Presentación",
        location: "Ubicación",
        stock: "Stock",
        emptyList: "La lista de insumos está vacía",
        empty_packs: "Envases vacíos",
        store_id: "Ubicación",
        product_id: "Producto",
        expiration_date: "Vencimiento",
        buy: "Comprar otro insumo",
        export: "Exportar datos",
        operationError: "Operación no permitida",
        notAvailable: "Función no disponible",
        invalidParams: "La consulta no devolvió resultados",
        bulk: "granel",
        ...UNITS_ABBRS.es
    }
};

export default itemList;