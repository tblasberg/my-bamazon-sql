var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "flowersinred",
    database: "bamazon",
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

//--------------------------------------
// Display products

function displayProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res.item_id);
        for (var i = 0; i < res.length; i++) {
            console.log("Id: " + res[i].item_id + " | " + "Product: " + res[i].product_name + "   |   " + "Price: $" + res[i].price);
            console.log("-----------------------------------------------------------------------------");
        }
        placeOrder(res);
    })
}

// ONE WAY TO USE ON INQUIRER

// arrayID = [];

// connection.query("SELECT item_id FROM products", function(err,res){
//     if (err) throw err
//     for (var x=0; x < res.length; x++){
//         console.log(res[x].item_id);
//         arrayID.push(res[x].item_id);
//     }
// })
// console.log(arrayID);    


// ANOTHER WAY TO USE ON INQUIRER - MAP

connection.query('SELECT * FROM products', function (error, results, fields) {
    products = results.map(element => {
        return (element.item_id + ": " + element.product_name + ": " + element.price);
    })
    // console.log(products);
})




//--------------------------------
//Place an Order
let remainderstock;
let selectedId;
let selectedIdJs;
let customerVolume;
let storeVolume;
let priceUnit;
let totalPrice;

console.log("customer volume - global: " + customerVolume);

function placeOrder(dbItems) {
    inquirer.prompt([{
            type: "list",
            name: "customerChoice",
            message: "Please let us know the ID number of the item you're interested.",
            choices: products
        },
        {
            type: "input",
            name: "customerUnits",
            message: "How many units would you like to buy?"
        }
    ]).then(answers => {
        let IdInd = answers.customerChoice.split(":")[0];

        dbItems.forEach((element, index) => {
            if (element.item_id == IdInd) {
                selectedIdJs = element.item_id;
                selectedId = element.item_id - 1;
                // console.log("selectedId: " + selectedId);
            }
        });

        connection.query('SELECT stock_quantity FROM products', function (error, results, fields) {
            if (error) throw error;

            // console.log(results[selectedId]);
            customerVolume = parseInt(answers.customerUnits);
            console.log("customerVolume: " + customerVolume);
            storeVolume = parseInt(results[selectedId].stock_quantity);


            // console.log("storeVolume: " + results[selectedId].stock_quantity);
            remainderstock = storeVolume - customerVolume;
            // console.log("Remainder: " + remainderstock);

            if (customerVolume <= storeVolume) {
                console.log("We have your product in stock!");
                updateDbStock();
                pricePerUnit().then((priceUnit) => {
                    finalCost(priceUnit, customerVolume);
                }).catch((err) => {
                    console.log('something bad happened', err);
                })
                
            } else {
                console.log("I'm sorry, we do not have enough items.");
            }
        })
    })
};


//---------------------------------------------------------
//UPDATE THE DATABASE

function updateDbStock() {
    connection.query('UPDATE products SET stock_quantity=? WHERE item_id = ?',
        [remainderstock, selectedIdJs],
        function (err, res) {
            if (err) throw err;

            console.log("DB updated! Remainerstock: " + remainderstock);
        })
}


//-----------------------------------------------------
// RETRIVE UNIT PRICE FROM DATABASE

function pricePerUnit() {
    return new Promise((resolve, reject) => {
        connection.query('SELECT price FROM products', function (error, results, fields) {
            if (error) return reject(error);
    
            priceUnit = parseInt(results[selectedId].price);
            console.log("priceUnit inside pricePerUnit(): " + priceUnit);
            return resolve(priceUnit);
        });
    });
}

//-----------------------------------------------------// CALCULATE FINAL COST FOR CUSTOMER 

function finalCost(price, quantity) {
    console.log("Price Unit inside finalCost(): " + priceUnit);
    console.log("Customer volume inside finalCost(): " + customerVolume);

    // finalCost = priceUnit * customerVolume;
    // console.log("Your final cost is: $" + finalCost);

}






displayProducts();


// connection.end();