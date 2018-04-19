// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
//Require path
var path = require('path');
// Integrate body-parser with our App
app.use(bodyParser.json());
// Require Mongoose
app.use(express.static(__dirname + '/client/dist'));
var mongoose = require('mongoose');
// This is how we connect to the mongodb database using mongoose -- "1955" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/authors');
var AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Name is required!"],
        minlength: [3, "Name must be at least 3 characters"]
    },
    quotes: [{
        content: {
            type: String,
            require: [true, "Quote is required!"],
            minlength: [3, "Quotes must be at least 3 characters"]
        },
        rank: {
            type: Number,
            default: 0
        }
    }]
}, { timestamps: true });
mongoose.model('Author', AuthorSchema);
var Author = mongoose.model('Author');
// Use native promises
mongoose.Promise = global.Promise;

app.get('/authors', function (req, res) {
    Author.find({}, function (err, authors) {
        // console.log(tasks);
        if (err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({ message: "Error", error: err });
        } else {
            // respond with JSON
            res.json({ message: "Success", data: authors });
        };
    });
});
app.get('/author/:id', function (req, res) {
    Author.findOne({ _id: req.params.id }, function (err, author) {
        if (err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({ message: "Error", error: err });
        } else {
            // respond with JSON
            res.json({ message: "Success", data: author });
        };
    });
});
app.post('/author/new', function (req, res) {
    var author = new Author(req.body);
    console.log("new author", author);
    // Try to save that new eagle to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    author.save(function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
            console.log('something went wrong with new item save');
            res.json({ message: "Error", error: err });
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added to the DB!');
            res.json({ message: "Success", data: author });
        };
    });
});
app.put('/author/update', function (req, res) {
    var id = req.body._id;
    // Try to save that new item to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    Author.update({ _id: id }, { name: req.body.name }, function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
            console.log('something went wrong with new item save');
            res.json({ message: "Error", error: err });
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully updated the DB!');
            res.json({ message: "Success" });
        };
    });
});
app.put('/quote/new', function (req, res) {
    var newQuote = req.body;
    // Try to save that new eagle to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
    Author.update({ _id: newQuote.author_id }, { $push: { quotes: { content: newQuote.quote, rank: 0 } } }, function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
            console.log('something went wrong with new item save');
            res.json({ message: "Error", error: err });
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully added to the DB!');
            res.json({ message: "Successful Quote Add" });
        };
    });
});
app.put('/quote/update', function (req, res) {
    var rankup = req.body;
    Author.update({ _id: rankup[2], 'quotes._id': rankup[0] }, { $set: { "quotes.$.rank": rankup[1] } }, function (err) {
        // if there is an error console.log that something went wrong!
        if (err) {
            console.log('something went wrong with new item save');
            res.json({ message: "Error", error: err });
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully updated the DB!');
            res.json({ message: "Success" });
        };
    });
});
app.put('/quote/remove', function (req, res) {
    var ids = req.body;
    Author.findOneAndUpdate({ _id: ids[0] }, { $pull: { "quotes": { _id: ids[1] } } }, function (err) {
        if (err) {
            console.log('something went wrong the destroy');
            res.json({ message: "Error", error: err });
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully removed quote!');
            res.json({ message: "Success" });
        };
    });
});
app.delete('/author/remove/:id', function (req, res) {
    Author.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log('something went wrong with save');
            res.json({ message: "Error", error: err });
        } else { // else console.log that we did well and then redirect to the root route
            console.log('successfully removed record!');
            res.json({ message: "Success" });
        };
    });
});

//Catch all routing
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./dist/index.html"))
});

// Setting our Server to Listen on Port: 8033
app.listen(8033, function () {
    console.log("listening on port 8033");
});