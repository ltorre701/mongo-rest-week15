// Convert all prices to euros (assuming 1 USD = 0.85 EUR)
let priceInEuros = {};
Object.entries(firstDoc).forEach(([key, value]) => {
    if (key === 'price_in_usd') {
        priceInEuros[key.replace('usd', 'eur')] = value * 0.85;
    } else {
        priceInEuros[key] = value;
    }
});
console.log(priceInEuros);