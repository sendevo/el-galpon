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
            product_id: 1,
            name: "Test Product"
        };
        await db.addItem(data, "products");
        const items = await db.getItems("products");
        expect(items).toHaveLength(1);
    });

    it("should retrieve items from 'goods'", async () => {
        const items = await db.getItems("goods");
        expect(Array.isArray(items)).toBe(true);
    });

    it("should retrieve stock of a product", async () => {
        const productStock = await db.getStockOfProduct(1);
        expect(Array.isArray(productStock)).toBe(true);
    });

    it("should retrieve operations for a good", async () => {
        const goodId = 1; // Replace with a valid good ID
        const operations = await db.getOperationsForGood(goodId);
        expect(Array.isArray(operations)).toBe(true);
    });
});