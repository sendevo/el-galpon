export const testData = {
    products: [ 
        {
            id: 34,
            name: "Glifosato",
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
            pack_size: 25,
            pack_unit: "kg",
            expirable: true,
            returnable: false,
            brand: "ACA 304",
            comments: "Cosecha 2021",
            categories: ["Semillas"],
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
            product_id: 35,
            store_id: 37,
            stock: 2,
            packs: null,
            expiration_date: 1731151088080
        }
    ]
};