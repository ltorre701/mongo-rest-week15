// First sort the documents by price
let sortedByPrice = [...documents].sort((a, b) => a.price_in_usd - b.price_in_usd);

// Use Object.entries to get just item and price from each document
for (let doc of sortedByPrice) {
    let filtered = {};
    Object.entries(doc).forEach(([key, value]) => {
        if (key === 'item' || key === 'price_in_usd') {
            filtered[key] = value;
        }
    });
    console.log(filtered);
}