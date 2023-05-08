const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")
const mongoose = require("mongoose")
const _ = require("lodash")

console.log(date());

const app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

mongoose.connect("mongodb+srv://sammy:onepiece@cluster0.i7cct4j.mongodb.net/todolistDB", {useNewUrlParser: true})


const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
})
const item2 = new Item({
    name: "Hit the +button to add a new item"
})
const item3 = new Item({
    name: "Hit the checkbox to remove an item"
})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);




app.get("/", function(req, res){
    
Item.find({})
.then((foundItems)=>{
if(foundItems.length===0){
    Item.insertMany(defaultItems)
}else{
    res.render("index",{kindOfDay: "Today", newListItems: foundItems});
}
})
})



app.get('/:id', (req,res)=>{
    const listId = _.capitalize(req.params.id);

    List.findOne({name: listId})
    .then((foundList)=>{
            
        if(!foundList){
            const list =new List({
                name: listId,
                items: defaultItems
            })

            list.save()
            res.redirect("/"+listId)
        }else{
            res.render("index", {kindOfDay: foundList.name, newListItems: foundList.items} )
        }

    }) 
})



app.post("/", function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list
    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){
        item.save()
        res.redirect("/")
    }else{
        
            List.findOne({name: listName})
            .then((foundList)=>{
                foundList.items.push(item)
                foundList.save()
                res.redirect("/" + listName)
            })
    }

    
})



app.post("/delete", (req,res)=>{
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName

    if(listName=== "Today"){
        Item.findByIdAndDelete(checkedItemId)
    .then((deletedItem)=>{
        console.log("Deleted Item")
    })
    .catch((err)=>{
        console.log(err)
    })

    res.redirect("/")

    }else{
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}})
        .then(data=>{
            console.log(data)
            console.log("deleted successfully")
            res.redirect("/"+ listName)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    
      
})



app.listen(3000);