//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const app=express();

const items =["Buy Food","Make Food","Eat Food"];
const workItems=[];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://jogianuj0503:x6E4CnXVd8QFOrqb@cluster0.8nesx4f.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemSchema = {
    name:String,
};
const item =mongoose.model("item", itemSchema);

const item1 = new item({
    name: "Welcome to your todo List!!"
});

const item2 = new item({
    name: "Hit the + plus button to add a work"
});

const item3 = new item({
    name: "<--- Hit this to delete an item"
});

const DefaultItems = [item1,item2,item3];

const ListSchema = {
    name: String,
    items :[itemSchema]
};


const List =mongoose.model("List",ListSchema)




app.get("/", async function(req,res){
    
    const foundItems = await item.find({});
 
    if (!(await item.exists())) {
      await item.insertMany(DefaultItems);
      res.redirect("/");
    } else {
      res.render("list", { ListTitle: "Today", newListItems: foundItems });
    }
});

app.post("/",  async function(req,res){
    const itemName= req.body.newListItems;
    const listName= req.body.list;
    
    const item4= new item({
        name:itemName,
    });


if (listName === "Today") {
        item4.save()
        res.redirect("/")
    } else {
 
        await List.findOne({ name: listName }).exec().then(foundList => {
            foundList.items.push(item4)
            foundList.save()
            res.redirect("/" + listName)
        }).catch(err => {
            console.log(err);
        });
    }


});

app.post("/delete", function (req, res) {

    const listName = req.body.listName;
    const checkItemId = req.body.checkbox;
  
    if (listName == "Today") {
      deleteCheckedItem();
    } else {
  
      deleteCustomItem();
    }
  
    async function deleteCheckedItem() {
      await Item.deleteOne({ _id: checkItemId });
      res.redirect("/");
    }
  
    async function deleteCustomItem() {
      await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkItemId } } }
      );
      res.redirect("/" + listName);
    }
  });


    app.get("/:customListName",function(req,res){
        const customListName = _.capitalize(req.params.customListName);
       
        List.findOne({name:customListName})
          .then(function(foundList){
              
                if(!foundList){
                  const list = new List({
                    name: customListName,
                    items:DefaultItems
                  });
                
                  list.save();
                  console.log("saved");
                  res.redirect("/"+customListName);
                }
                else{
                  res.render("list",{ListTitle:foundList.name, newListItems:foundList.items});
                }
          })
          .catch(function(err){});
       
       
        
        
      })
    

app.get("/about",function(req,res){
    res.render("about");
})


app.listen(3000,function(){
    console.log("Server running on port 3000");
})