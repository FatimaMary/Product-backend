const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

app.post("/", (request, response) => {
    const newProduct = request.body;
    console.log("line19: " + newProduct);

    let db = new sqlite3.Database("db/AddProduct.db");
    let insertQuery = "INSERT INTO ProductTable(ProductName, Description, Category, Quantity, Sku, Weight, Length, Breadth, Width, Price, ComparePrice) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        newProduct.ProductName,
        newProduct.Description,
        newProduct.Category,
        newProduct.Quantity,
        newProduct.Sku,
        newProduct.Weight,
        newProduct.Length,
        newProduct.Breadth,
        newProduct.Width,
        newProduct.Price,
        newProduct.ComparePrice
    ];
    console.log("values 37:" + values)
    db.run(insertQuery, values, (err) => {
        if(err){
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Successfully inserted Stack"
            });
        }
    });
    db.close();
});

app.get("/", (request, response) => {
    let db = new sqlite3.Database("db/AddProduct.db");

    const selectQuery = "SELECT ProductId, ProductName, Description, Category, Quantity, Sku, Weight, Length, Breadth, Width, Price, ComparePrice FROM ProductTable";

    db.all(selectQuery, [], (err, rows) => {
        if(err){
            response.json({
                message: err.message,
            });
        } else {
            const Products = rows.map((singleProduct) => {
                return{
                    ProductId: singleProduct.ProductId,
                    ProductName: singleProduct.ProductName,
                    Description: singleProduct.Description,
                    Category: singleProduct.Category,
                    Quantity: singleProduct.Quantity,
                    Sku: singleProduct.Sku,
                    Weight: singleProduct.Weight,
                    Length: singleProduct.Length,
                    Breadth: singleProduct.Length,
                    Width: singleProduct.Width,
                    Price: singleProduct.Price,
                    ComparePrice: singleProduct.ComparePrice
                };
            });
            response.json(Products);
            console.log("line 79:" +Products);
        }
    });
    db.close();
});

app.put("/", (request, response) => {
    const updatedProduct = request.body;
    let db = new sqlite3.Database("db/AddProduct.db");

    const updatedData = [
        updatedProduct.ProductName,
        updatedProduct.Description,
        updatedProduct.Category,
        updatedProduct.Quantity,
        updatedProduct.Sku,
        updatedProduct.Weight,
        updatedProduct.Length,
        updatedProduct.Breadth,
        updatedProduct.Width,
        updatedProduct.Price,
        updatedProduct.ComparePrice
    ];
    const productId = updatedProduct.ProductId;
    const updatedQuery = "UPDATE ProductTable SET ProductName = ?, Description = ?, Category = ?, Quantity = ?, Sku = ?, Weight = ?, Length = ?, Breadth = ?, Width = ?, Price = ?, ComparePrice = ?";
    const values = [...updatedData, productId];

    db.run(updatedQuery, values, (err) => {
        if(err){
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Product Updated"
            });
        }
    });
    db.close();
});

app.delete("/", (request, response) => {
    const productId = parseInt(request.body.ProductId);
    console.log("line 122:" + productId);
    let db = new sqlite3.Database("db/AddProduct.db");
    const values = [productId];

    const deleteQuery = "DELETE FROM AddTable WHERE productId = ?";

    db.run(deleteQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json({
                message: "Product Deleted"
            }); 
        }
    });
    db.close();
});

app.listen(2318, () => {
    console.log('Start Listening, use 2318')
})