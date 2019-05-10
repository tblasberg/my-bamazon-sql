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

function displayProducts(callback){
    connection.query("SELECT * FROM products", function(err,res){
        if (err) throw err;
        console.log(res.item_id);
        for (var i = 0; i < res.length; i++){
            console.log("Id: " + res[i].item_id +  " | " + "Product: " + res[i].product_name + "   |   " + "Price: $" + res[i].price);
            console.log("-----------------------------------------------------------------------------");
        }
    })
}

function placeOrder(){
inquirer.prompt([{
    type: "input",
    name: "customerChoice",
    message: "Please let us know the ID number of the item you're interested."
},
{ 
    type: "input",
    name: "customerUnits",
    message: "How many units would you like to buy?"
}]).then(answers => {
    console.log(answers);
})};


displayProducts(placeOrder());

connection.end();