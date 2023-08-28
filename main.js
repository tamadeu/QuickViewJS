var urlProduts = `https://dummyjson.com/products`;
const xhrProducts = new XMLHttpRequest();
xhrProducts.open("GET", urlProduts, false);
xhrProducts.send();

const products = JSON.parse(xhrProducts.responseText);

qv({
    "products": products.products,
    "siteName": "quickviewJS",
    "date": new Date(),
    "qttyProducts": 98
});