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
                //RUN ANOTHER QUERY AND DO A DROPDOWN MENU ON TYPE
        }]).then(answers => {
            let IdInd = answers.customerChoice.split(":")[0];

            dbItems.forEach((element, index) => {
                if(element.item_id == IdInd){
                    console.log("Got this far");
                } 
            });

            var quantityOfChosenItem = dbItems.stock_quantity;
            if(quantityOfChosenItem >= answers.customerUnits){
                console.log("Item in stock");
            }


})};










displayProducts();
// checkCustomerOrder();

connection.end();

