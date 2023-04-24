const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js");

console.log(date());

const app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


var items = ["cook","eat","sleep"];

app.get("/", function(req, res){


let day = date();



    res.render("index",{kindOfDay: day, newListItems: items});
})




app.post("/", function(req,res){

    items.push(req.body.newItem);

    res.redirect("/");
})




app.listen(3000);