import { UNITS_NAMES } from "../../constants";

const itemList = {
    en: {
        title: "Items",
        product: "Product",
        presentation: "Presentation",
        location: "Location",
        stock: "Stock",
        emptyPacks: "Empty packs",
        expiration: "Expiration",
        buy: "Buy items",
        export: "Export data",
        operationError: "Operation not allowed",
        not_available: "Not available function",
        bulk: "bulk",
        ...UNITS_NAMES.en
    },
    es: {
        title: "Insumos",
        product: "Producto",
        presentation: "Presentación",
        location: "Ubicación",
        stock: "Stock",
        emptyPacks: "Envases vacíos",
        expiration: "Vencimiento",
        buy: "Comprar insumos",
        export: "Exportar datos",
        operationError: "Operación no permitida",
        not_available: "Función no disponible",
        bulk: "granel",
        ...UNITS_NAMES.es
    }
};

export default itemList;