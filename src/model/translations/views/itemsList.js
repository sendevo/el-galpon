import { UNITS_ABBRS } from "../../constants";

const itemList = {
    en: {
        returns: "Returns",
        product: "Product",
        name: "Name",
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
        notAvailableLocation: "Not available",
        invalidParams: "Query returned no results",
        bulk: "bulk",
        store: "Store",
        created: "Created",
        modified: "Modified",
        viewMap: "View on Google Maps",
        ...UNITS_ABBRS.en
    },
    es: {
        returns: "Devoluciones",
        product: "Producto",
        name: "Nombre",
        presentation: "Presentación",
        location: "Ubicación",
        stock: "Insumos",
        emptyList: "La lista de insumos está vacía",
        empty_packs: "Envases vacíos",
        store_id: "Ubicación",
        product_id: "Producto",
        expiration_date: "Vencimiento",
        buy: "Ingresar otro insumo",
        export: "Exportar datos",
        operationError: "Operación no permitida",
        notAvailable: "Función no disponible",
        notAvailableLocation: "No disponible",
        invalidParams: "La consulta no devolvió resultados",
        bulk: "granel",
        store: "Depósito",
        created: "Creado",
        modified: "Modificado",
        viewMap: "Ver en Google Maps",
        ...UNITS_ABBRS.es
    }
};

export default itemList;