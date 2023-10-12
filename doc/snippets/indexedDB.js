// Define a name for your database
const dbName = "StockManagementDB";
const dbVersion = 1;

// Open or create the IndexedDB database
const request = indexedDB.open(dbName, dbVersion);

// Handle database upgrades or creation
request.onupgradeneeded = function (event) {
  const db = event.target.result;

  // Create an object store (similar to a table in relational databases)
  if (!db.objectStoreNames.contains("inventory")) {
    db.createObjectStore("inventory", { keyPath: "id", autoIncrement: true });
  }
};

// Handle successful database connection
request.onsuccess = function (event) {
  const db = event.target.result;

  // Perform database operations
  addProductToInventory(db, { name: "Product A", quantity: 100 });
  readInventory(db);
};

// Handle errors
request.onerror = function (event) {
  console.error("Database error: " + event.target.errorCode);
};

// Function to add a product to the inventory
function addProductToInventory(db, product) {
  const transaction = db.transaction(["inventory"], "readwrite");
  const store = transaction.objectStore("inventory");

  // Add the product to the object store
  const request = store.add(product);

  // Handle the result of the add operation
  request.onsuccess = function (event) {
    console.log("Product added to inventory.");
  };

  request.onerror = function (event) {
    console.error("Error adding product to inventory: " + event.target.errorCode);
  };
}

// Function to read the inventory
function readInventory(db) {
  const transaction = db.transaction(["inventory"], "readonly");
  const store = transaction.objectStore("inventory");

  const request = store.openCursor();

  request.onsuccess = function (event) {
    const cursor = event.target.result;
    if (cursor) {
      console.log("Product: ", cursor.value);
      cursor.continue();
    } else {
      console.log("No more products in inventory.");
    }
  };

  request.onerror = function (event) {
    console.error("Error reading inventory: " + event.target.errorCode);
  };
}
