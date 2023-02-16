const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const { json, request } = require("express");

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

app.post("/newentry", (request, response) => {
    const newEntry = request.body;
    console.log("New Entry List: " + newEntry);

    let db = new sqlite3.Database("db/AddProduct.db");

    const insertQuery = "INSERT INTO AutoParts(Customer, CustomerPartNo, Description, Location, MinStock, MaxStock, PackingStandard) VALUES(?, ?, ?, ?, ?, ?, ?)";

    const values = [
        newEntry.Customer,
        newEntry.CustomerPartNo,
        newEntry.Description,
        newEntry.Location,
        newEntry.MinStock,
        newEntry.MaxStock,
        newEntry.PackingStandard
    ];
    console.log("post values: " + values);

    db.run(insertQuery, values, (err) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            response.json ({
                message: "New Entry Updated"
            });
        }
    });
    db.close();
});

app.get("/newentry/details/:CustomerPartNo", (request, response) => {
    let db = new sqlite3.Database("db/AddProduct.db");

    const selectQuery = "SELECT Customer, CustomerPartNo, Description, Location, MinStock, MaxStock, PackingStandard FROM AutoParts WHERE CustomerPartNo = ?";

    db.all(selectQuery, [request.params.CustomerPartNo], (err, rows) => {
        if(err){
            response.json({
                message: err.message,
            });
        } else {
            const parts = rows.map((singlePart) => {
                return{
                    Id: singlePart.Id,
                    Customer: singlePart.Customer,
                    CustomerPartNo: singlePart.CustomerPartNo,
                    Description: singlePart.Description,
                    Location: singlePart.Location,
                    MinStock: singlePart.MinStock,
                    MaxStock: singlePart.MaxStock,
                    PackingStandard: singlePart.PackingStandard
                };
            });
            response.json(parts[0]);
            console.log("List of Auto Parts:" + JSON.stringify(parts));
        }
    });
    db.close();
});

app.get("/newentry/:id", (request, response) => {
    let db = new sqlite3.Database("db/AddProduct.db");

    const selectQuery = "SELECT CustomerPartNo FROM AutoParts WHERE Id = ?";

    db.all(selectQuery, [parseInt(request.params.id)], (err, rows) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            const partNo = rows.map((singlePart) => {
                return{
                    Id: singlePart.Id,
                    CustomerPartNo: singlePart.CustomerPartNo,
                }
            });
            response.json(partNo[0]);
            console.log("Customer Part NO: " +JSON.stringify(partNo))
        }
    });
    db.close();
});

app.get("/newentry", (request, response) => {
    let db = new sqlite3.Database("db/AddProduct.db");

    const selectQuery = "SELECT CustomerPartNo FROM AutoParts";

    db.all(selectQuery, [], (err, rows) => {
        if(err) {
            response.json({
                message: err.message,
            });
        } else {
            const partNo = rows.map((singlePart) => {
                return{
                    Id: singlePart.Id,
                    CustomerPartNo: singlePart.CustomerPartNo,
                }
            });
            response.json(partNo);
            console.log("Single Customer Part NO: " +JSON.stringify(partNo))
            // const partNo = CustomerPartNo;
            // const selectQuery = "SELECT Description, Customer, Location, PackingStandard FROM AutoParts WHERE CustomerPartNo = ?";
            // const values = [CustomerPartNo];
            // db.all(selectQuery, values, (err, rows) => {
            //     if(err) {
            //         response.json({
            //             message:err.message,
            //         });
            //     } else {
            //         const customerDetails = rows.map((singleData) => {
            //             return{
            //                 Description: singleData.Description,
            //                 Customer: singleData.Customer,
            //                 Location: singleData.Location,
            //                 PackingStandard: singleData.PackingStandard
            //             }
            //         });
            //         response.json(customerDetails);
            //         console.log("Customer Details: " + customerDetails)
            //     }
            // })
        }
    });
    db.close();
});

app.post("/checkin", (request, response) => {
    const newActivity = request.body;

    let db = new sqlite3.Database("db/AddProduct.db");
    const insertQuery = "INSERT INTO ActivityTable(CustomerPartNo, Activity, BinCount, Location, StockId) VALUES(?, ?, ?, ?, ?)";
    const values = [
        newActivity.CustomerPartNo,
        newActivity.Activity,
        newActivity.BinCount,
        newActivity.Location,
        newActivity.StockId
    ];

    db.run(insertQuery, values, (err) => {
        if(err){
            response.json({
                message: err.message
            });
        } else {
            response.json({
                message: "Activity Updated"
            });
        }
    });
    db.close();
});

app.get("/checkin", (request, response) => {
    let db = new sqlite3.Database("db/AddProduct.db");

    const selectQuery = "SELECT ActivityId, CustomerPartNo, Activity, BinCount, Location, StockId FROM ActivityTable";

    db.all(selectQuery, [], (err, rows) => {
        if(err){
            response.json({
                message: err.message
            });
        } else {
            const data = rows.map((singledata) => {
                return{
                    ActivityId: singledata.ActivityId,
                    CustomerPartNo: singledata.CustomerPartNo,
                    Activity: singledata.Activity,
                    BinCount: singledata.BinCount,
                    Location: singledata.Location,
                    StockId: singledata.StockId,
                }
            });
            response.json(data);
            console.log("Checkin data "+ data);
        }
    })
})

app.listen(2318, () => {
    console.log('Start Listening, use 2318')
});