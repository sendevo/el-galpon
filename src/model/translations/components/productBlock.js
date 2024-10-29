import { UNITS_ABBRS } from "../../constants";

const productBlock = {
    en: {
        product: "Product",
        quantity: "Quantity",
        destination: "Destination",
        current_location: "Current location",
        total_amount: "Total amount",
        presentation: "Presentation",
        bulk: "Bulk",
        ...UNITS_ABBRS.en
    },
    es: {
        product: "Producto",
        quantity: "Cantidad",
        destination: "Destino",
        current_location: "Ubicación actual",
        total_amount: "Cantidad total",
        presentation: "Presentación",
        bulk: "A granel",
        ...UNITS_ABBRS.es
    }
};

export default productBlock;