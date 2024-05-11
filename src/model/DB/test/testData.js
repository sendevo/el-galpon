export const testData = {
    products: [ 
        {
            id: 34,
            name: "Glifosato",
            sku: "10-01111-0",
            pack_size: 20,
            pack_unit: "l",
            expirable: true,
            returnable: true,
            brand: "Estrella",
            comments: "",
            categories: ["Herbicidas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 35,
            name: "Urea granulada",
            sku: "03-1234-1",
            pack_size: 1,
            pack_unit: "ton",
            expirable: true,
            returnable: false,
            brand: "Profertil",
            comments: "",
            categories: ["Fertilizantes"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 38,
            name: "Trigo",
            sku: "",
            pack_size: 25,
            pack_unit: "kg",
            expirable: true,
            returnable: false,
            brand: "ACA 304",
            comments: "Cosecha 2021",
            categories: ["Semillas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 10,
            name: "Maíz",
            sku: "",
            pack_size: 80000,
            pack_unit: "u",
            expirable: false,
            returnable: false,
            brand: "ACA 477",
            comments: "",
            categories: ["Semillas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 12,
            name: "Girasol",
            sku: "",
            pack_size: 180000,
            pack_unit: "u",
            expirable: true,
            returnable: false,
            brand: "ACA 220",
            comments: "",
            categories: ["Semillas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 8,
            name: "Silobolsa",
            sku: "MA-0000",
            pack_size: 50,
            pack_unit: "m",
            expirable: false,
            returnable: false,
            brand: "Pentasilo Manta",
            comments: "Film de polietileno pentacapa (5 capas), bicolor (exterior blanco e interior negro), coextrusado con plástico virgen de altísima calidad",
            categories: ["Silobolsas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 9,
            name: "Suplemento vitamínico",
            sku: "16-023008",
            pack_size: 25,
            pack_unit: "kg",
            expirable: true,
            returnable: false,
            brand: "AF Mix ADQ Preparto Aniónica",
            comments: "Recomendamos ingresar las vacas al lote y dosificar en la ración 21 días antes del parto",
            categories: ["Nutrición animal"],
            created: 1693683312000,
            modified: 1693683312000
        }
    ],
    stores: [
        {
            id: 34,
            name: "YPF Agro - Pedro Luro",
            lat: -39.4993953,
            lng: -62.6767609,
            contact: {
                name: "Fulano",
                phone: "299 - 235 15123",
                address: "Calle 38 1231"
            },
            created: 1693683312000,
            modified: 1693683312000
            
        },
        {
            id: 35,
            name: "Galpón",
            lat: -39.363867,
            lng: -62.685075,
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 36,
            name: "Silo IV",
            lat: -39.365102,
            lng: -62.680214,
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: 37,
            name: "Silito",
            lat: -39.365102,
            lng: -62.680214,
            created: 1693683312000,
            modified: 1693683312000
        }
    ],
    items: [
        {
            id: 1,
            product_id: 34,
            store_id: 35,
            stock: 10,
            packs: 10,
            expiration_date: 1731151088080
        },
        {
            id: 2,
            product_id: 35,
            store_id: 36,
            stock: 5.5,
            packs: null,
            expiration_date: 1731151088080
        },
        {
            id: 5,
            product_id: 38,
            store_id: 35,
            stock: 2,
            packs: null,
            expiration_date: 1731151088080
        },
        {
            id: 4,
            product_id: 10,
            store_id: 34,
            stock: 2,
            packs: null,
            expiration_date: 1731151088080
        },
        {
            id: 3,
            product_id: 12,
            store_id: 34,
            stock: 2,
            packs: null,
            expiration_date: 1731151088080
        }
    ]
};