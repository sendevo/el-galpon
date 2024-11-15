const url = new URL('http://example.com/view?stock:lt:20&empty_packs:gt:1'); // Stock less than 20 and empty packs greater than 1
const urlParams = new URLSearchParams(url.search);

let filters = [];
urlParams.forEach((value, key) => {
    const [k, op, v] = key.split(':');
    const parsed = { k, op, v };
    filters.push(parsed);
});

console.log(filters);