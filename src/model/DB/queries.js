import { levenshteinDistance } from "../utils";

export const getStockOfProduct = (db, goodId) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['goods'], 'readonly');
        const store = transaction.objectStore('goods');
        const index = store.index('product_id');
        const request = index.getAll(IDBKeyRange.only(goodId));
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
};

export const getOperationsForGood = (db, goodId) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(['operations'], 'readonly');
        const store = transaction.objectStore('operations');
        const index = store.index('good_id');
        const request = index.getAll(IDBKeyRange.only(goodId));
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
};

export const searchTerm = (db, section, attr, term, thresh) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const request = db
            .transaction(section, 'readonly')
            .objectStore(section)
            .openCursor();
        request.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                const similarity = levenshteinDistance(term, cursor.value[attr]);
                if (similarity <= thresh) 
                    results.push({id: cursor.value.id, similarity});
                cursor.continue();
            } else {
                results.sort((a, b) => a.similarity - b.similarity);
                resolve(results);
            }
        };
        request.onerror = event => reject(event.target.error);
    });
};