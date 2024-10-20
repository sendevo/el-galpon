import LocalDatabase from "../src/model/DB";

let db;

beforeAll(() => {
    db = new LocalDatabase();
});

afterAll(() => {
    db._db.close();
});

describe("Database Operations", () => {
    it("should add an item to 'products'", async () => {
        const data = {
            name: "Glifosato",
            pack_sizes: 20,
            pack_units: "l",
            expirable: true,
            returnable: true,
            brand: "Estrella",
            comments: "",
            categories: ["Herbicidas"],
            created: 1693683312000,
            modified: 1693683312000
        };
        await db.insert("products", data);
        const items = await db.query("products");
        expect(items).toHaveLength(1);
    });

    it("should retrieve items from 'items'", async () => {
        const items = await db.query("items");
        expect(Array.isArray(items)).toBe(true);
    });

    it("should retrieve stock of a product", async () => {
        const productStock = await db.getStockOfProduct(1);
        expect(Array.isArray(productStock)).toBe(true);
    });

    it("should retrieve operations for a item", async () => {
        const itemId = 1; // Replace with a valid item ID
        const operations = await db.getOperationsForItem(itemId);
        expect(Array.isArray(operations)).toBe(true);
    });
});