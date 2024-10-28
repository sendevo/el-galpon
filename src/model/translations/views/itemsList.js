import { UNITS_ABBRS } from "../../constants";

const itemList = {
    en: {
        title: "Items",
        returns: "Returns",
        product: "Product",
        presentation: "Presentation",
        location: "Location",
        stock: "Stock",
        emptyPacks: "Empty packs",
        expiration: "Expiration",
        buy: "Buy other products",
        export: "Export data",
        operationError: "Operation not allowed",
        not_available: "Not available function",
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
        emptyPacks: "Envases vacíos",
        expiration: "Vencimiento",
        buy: "Comprar otro insumo",
        export: "Exportar datos",
        operationError: "Operación no permitida",
        not_available: "Función no disponible",
        bulk: "granel",
        ...UNITS_ABBRS.es
    }
};

export default itemList;