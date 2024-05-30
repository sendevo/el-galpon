export const testData = {
    version: 1,
    products: [ 
        {
            id: "0394-jfuqgtdh4-23hj2h4",
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
            id: "9763-ghfjg-3hj4-3hj4",
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
            id: "342-fserrt-45234",
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
            id: "123b-1lk2j3-k123",
            name: "Maíz",
            sku: "",
            pack_size: 80000,
            pack_unit: "semillas",
            expirable: false,
            returnable: false,
            brand: "ACA 477",
            comments: "",
            categories: ["Semillas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: "1123-4jkhg1gfy-1da57-3412",
            name: "Girasol",
            sku: "",
            pack_size: 180000,
            pack_unit: "semillas",
            expirable: true,
            returnable: false,
            brand: "ACA 220",
            comments: "",
            categories: ["Semillas"],
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: "6123-dfase4a-r3wa",
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
            id: "8750-abudtyeu-123jg",
            name: "2,4D",
            sku: "RD-0021",
            pack_size: 20,
            pack_unit: "l",
            expirable: true,
            returnable: true,
            brand: "Monsanto",
            comments: "",
            categories: ["Herbicidas"],
            created: Date.now(),
            modified: Date.now()
        },
        {
            id: "9120-dfasert4-a34afda",
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
        },
        {
            id: "251-dta34-4q2wedfa",
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
        },
    ],
    stores: [
        {
            id: "000-10283-daifh-hflaksu",
            name: "Agronomia",
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
            id: "1029-fad7f-35va",
            name: "Galpón",
            lat: -39.363867,
            lng: -62.685075,
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: "124-sdd5yst-543",
            name: "Silo IV",
            lat: -39.365102,
            lng: -62.680214,
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: "77345-fgsdf-23425",
            name: "Silo III",
            lat: -39.365102,
            lng: -62.680214,
            created: 1693683312000,
            modified: 1693683312000
        },
        {
            id: "7231-fddr6hs-345fas3",
            name: "Tinglado",
            lat: -39.363867,
            lng: -62.685075,
            created: 1693683312000,
            modified: 1693683312000
        }
    ],
    items: [
        {
            id: "2412-f9a8dsf-3452wdfa",
            product_id: "0394-jfuqgtdh4-23hj2h4",
            store_id: "1029-fad7f-35va",
            stock: 10,
            packs: 10,
            expiration_date: 1731151088080
        },
        {
            id: "41234-fasdgf-34232",
            product_id: "0394-jfuqgtdh4-23hj2h4",
            store_id: "000-10283-daifh-hflaksu",
            stock: 0,
            packs: 5,
            expiration_date: 1731151088080
        },
        {
            id: "7209-fadsifaa-3rawd",
            product_id: "9763-ghfjg-3hj4-3hj4",
            store_id: "124-sdd5yst-543",
            stock: 5.5,
            packs: 0,
            expiration_date: 1731151088080
        },
        {
            id: "7634-34v23c2-va345a",
            product_id: "9763-ghfjg-3hj4-3hj4",
            store_id: "77345-fgsdf-23425",
            stock: 2,
            packs: 0,
            expiration_date: 1731151088080
        },
        {
            id: "453-fcasdf-a45s",
            product_id: "9763-ghfjg-3hj4-3hj4",
            store_id: "1029-fad7f-35va",
            stock: 2,
            packs: 0,
            expiration_date: 1731151088080
        },
        {
            id: "1241-gtfsr-3453-6",
            product_id: "123b-1lk2j3-k123",
            store_id: "000-10283-daifh-hflaksu",
            stock: 2,
            packs: 0,
            expiration_date: 1731151088080
        },
        {
            id: "4234-42kjbnk-23gv4k",
            product_id: "1928-auysd6-aw876d",
            store_id: "000-10283-daifh-hflaksu",
            stock: 2,
            packs: 0,
            expiration_date: 1731151088080
        },
        {
            id: "2342-23lj42-23ku4g",
            product_id: "8750-abudtyeu-123jg",
            store_id: "000-10283-daifh-hflaksu",
            stock: 3,
            packs: 5,
            expiration_date: 1731151088080
        },
        {
            id: "123-dfads-342351",
            product_id: "1928-auysd6-aw876d",
            store_id: "124-sdd5yst-543",
            stock: 0,
            packs: 0,
            expiration_date: 1731151088080
        }
    ]
};