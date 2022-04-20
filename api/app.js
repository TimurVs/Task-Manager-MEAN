const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose')
const { List, Task} = require('./db/models');

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/lists', (req, res) => {
    List.find({}).then((lists)=>{
        res.send(lists)
    });
});

app.post('/lists', (req, res) => {
    let title = req.body.title;

    let newList = new List({
        title
    });
    newList.save().then((listDoc) => {
        res.send(listDoc)
        });
});

app.patch('/lists/:id', (req,res)=> {
    List.findOneAndUpdate({_id: req.params.id}, {$set: req.body})
        .then(()=> {
            res.sendStatus(200)
        })
});

app.delete('/lists/:id', (req, res)=> {
        List.findOneAndRemove({_id: req.params.id})
            .then((removedListDoc) => {
                res.send(removedListDoc);
            }).catch((e)=>{
            console.log("Error while attempting to delete an Item");
            console.log(e);
        })
});

app.get('/lists/:listId/tasks', (req, res)=> {
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks)
    })
});

app.get('/lists/:listId/tasks/:taskId', (req, res) =>{
    console.log('Hello GET')
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    })
        .then((task) => {
            res.send(task)
        })
})

app.post('/lists/:listId/tasks', (req, res)=>{
    let newTask = new Task({
        title: req.body.title,
        _listId: req.params.listId
    });
    newTask.save().then((newTaskDoc)=>{
        res.send(newTaskDoc);
    })
});

app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    console.log('Hello')
    Task.findOneAndUpdate({
        _listId: req.params.listId,
        _id: req.params.taskId
    },{$set : req.body})
        .then(()=>{res.sendStatus(200)})
        .catch((e) => {
            console.log(e)
        });
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {

    List.findOne({
        _id: req.params.listId
    }).then(() => {
            Task.findOneAndRemove({
                _id: req.params.taskId,
                _listId: req.params.listId
            }).then((removedTaskDoc) => {
                res.send(removedTaskDoc);
            })
    });
});


app.listen(3000, ()=> {
    console.log('Server is running port 3000')
});
