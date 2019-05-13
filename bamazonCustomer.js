var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "flowersinred",
  database: "bamazon",
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
  });

//--------------------------------------
// Display products

function displayProducts(){
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.log(res.item_id);
        for (var i = 0; i < res.length; i++){
            console.log("Id: " + res[i].item_id +  " | " + "Product: " + res[i].product_name + "   |   " + "Price: $" + res[i].price);
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

connection.query('SELECT * FROM products', function(error, results, fields){
    products = results.map(element => {
        return (element.item_id + ": " + element.product_name + ": " + element.price);
    })
    console.log(products);
})




//--------------------------------
//Place an Order

function placeOrder(dbItems){
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
        }]).then(answers => {
            let IdInd = answers.customerChoice.split(":")[0];
            let selectedId;

           dbItems.forEach((element, index) => {
                if(element.item_id == IdInd){
                    selectedId = element.item_id 
                    // console.log("selectedId: " + selectedId);
                } 
            });

            connection.query('SELECT stock_quantity FROM products', function(error, results, fields){
                if(error) throw error;
                
            // console.log(results[selectedId]);
            let customerVolume = parseInt(answers.customerUnits);
            console.log(customerVolume);
            let storeVolume = parseInt(results[selectedId].stock_quantity);
            console.log("storeVolume: " + storeVolume);
            let remainderstock = storeVolume - customerVolume;
            console.log("Remainder: " + remainderstock);

            if(customerVolume <= storeVolume){
                console.log("We have your product in stock!"); 
                if(remainderstock > 0){
                    console.log("Update DB");
                }
            }
            else { 
                console.log("I'm sorry, we do not have enough items.");
            }
            })
})};










displayProducts();
// checkCustomerOrder();

// connection.end();

