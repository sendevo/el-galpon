import { UNITS_ABBRS } from "../../constants";

const productForm = {
    en: {
        // View title
        default_title: "Product creation",
        edit_title: "Product edition",
        creation_title: "Product creation",
        
        // Labels
        product: "Product",
        name: "Name",
        no_name: "No name",
        presentations: "Product presentations",
        presentation: "Presentation",
        size: "Size",
        unit_label: "Unit",
        bulk_presentation: "Bulk sale",
        bulk: "Bulk",
        expiration: "Packaging recycling and expiration",
        expirable: "With expiration",
        not_expirable: "Without expiration",
        returnable: "Returnable",
        not_returnable: "Not returnable",
        aditional_details: "Aditional details",
        brand: "Brand/Manufacturer",
        sku: "SKU",
        categories: "Categories",
        comments: "Comments",
        not_allowed_edit_fields: "These fields can't be edited for created products",
        mandatory_fields: "Mandatory fields",
        confirm: "Confirm",
        cancel: "Cancel",

        // Units
        ...UNITS_ABBRS.en,

        // Messages
        missing_field: "Missing field: ",
        pack_sizes: "Presentation",
        pack_label: "Package",
        updated_data: "Data updated",
        new_product_created: "New product created",
        at_least_one_presentation: "There must be at least one presentation",
        cannot_remove_this_presentation: "This presentation cannot be removed"
    },
    es: {
        // View title
        default_title: "Creación de producto",
        edit_title: "Edición de producto",
        creation_title: "Creación de producto",
        
        // Labels
        product: "Producto",
        name: "Nombre",
        no_name: "Sin nombre",
        presentations: "Presentaciones del producto",
        presentation: "Presentación",
        size: "Medida",
        unit_label: "Unidad",
        bulk: "A granel",
        bulk_presentation: "Venta a granel",
        expiration: "Reciclaje y caducidad de envases",
        expirable: "Con vencimiento",
        not_expirable: "Sin vencimiento",
        returnable: "Retornable",
        not_returnable: "No retornable",
        aditional_details: "Detalles adicionales",
        brand: "Marca/Fabricante",
        sku: "SKU",
        categories: "Categorías",
        comments: "Comentarios",
        not_allowed_edit_fields: "Las presentaciones originales no se pueden editar",
        mandatory_fields: "Campos obligatorios",
        confirm: "Confirmar",
        cancel: "Cancelar",

        // Units
        ...UNITS_ABBRS.es,

        // Messages
        missing_field: "Campo faltante: ",
        pack_sizes: "Presentación",
        pack_label: "Envase",
        updated_data: "Datos actualizados",
        new_product_created: "Producto creado",
        at_least_one_presentation: "Debe haber al menos una presentación",
        cannot_remove_this_presentation: "No se puede eliminar esta presentación"
    }
};

export default productForm;