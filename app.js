const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const credentials = require(__dirname+'/credential.js');

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const mongoDBConnectionURL = "mongodb://localhost/todoDB";
const mongoDBConnectionURL = credentials.mongoDBConnectionURL;

mongoose.connect(mongoDBConnectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const defaultItems = credentials.defaultItems;

const todoSchema = new mongoose.Schema({
    item: String
});

const Todo = mongoose.model('todo', todoSchema);

app.route("/")
    .get((req, res) => {

        Todo
        .find()
        .then((items)=>{
            if(items.length===0){
                Todo
                .insertMany(defaultItems)
                .then(()=> res.redirect("/"))
                .catch((err)=> console.log(err))
            }else{
                res.render("list", { items: items });
            }
        })
        .catch((err)=> console.log(err));
    })

    .post((req, res) => {
        const newItem = req.body.newItem;
        Todo
        .create({item: newItem})
        .then(() => res.redirect("/"))
        .catch((err) => console.log(err))
    });

app.post("/delete", (req, res) => {
    Todo
    .findByIdAndDelete(req.body.itemId)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server Started at port 3000");
});