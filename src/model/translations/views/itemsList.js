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
        emptyPacks: "Empty packs",
        expiration: "Expiration",
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
        emptyPacks: "Envases vacíos",
        expiration: "Vencimiento",
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