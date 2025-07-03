# ROUTES





// GET	/	        Menampilkan seluruh product yang ada di database
// GET	/product	Menampilkan seluruh product yang ada di database yang memiliki stock lebih dari 0
// GET	/product/buy/:id	Membeli product dari gadgetStore dan mengurangi stock dari product
GET /product/detail/:id
// GET	/product/add	Menampilkan form untuk menambahkan product
// POST	/product/add	Menambahkan data product ke database
// GET	/product/edit/:id	Menampilkan form untuk merestock product
// POST	/product/edit/:id	Mengupdate jumlah stock product berdasarkan form restock product
// GET	/product/delete/:id	Menghapus product dari database

| Route                        | Purpose & Button Description                                               |
| ---------------------------- | -------------------------------------------------------------------------- |
| GET /product             | Show all products (main home/list page). /[Home]                       |
| GET /product/add         | Show form to add a new product. /[Add Product]                         |
| POST /product/add        | Submit new product to DB. Triggered by add form. /[Submit Add Product] |
| GET /product/sell        | Show sell page/list for selling gadgets. /[Sell]                       |
| POST /product/sell/:id  | Decrement stock by 1, for selling an item. /[Sell 1 Unit]              |
| GET /product/buy/:id    | Decrement stock by 1, for buying an item. /[Buy]                       |
| GET /product/empty       | Show out-of-stock products only. /[Show Out of Stock]                  |
| GET /product/delete/:id | Delete a product. /[Delete]                                            |


1. Image
2. Name
3. Price
4. Stock
5. Type
6. Serial Code
7. Action : Buy (GET /product/buy/:id) dan Detail (/product/detail/:id)