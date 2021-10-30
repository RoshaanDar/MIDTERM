// create a reference to the model
let Book = require('../models/book');
var mongoose = require('mongoose');
// Gets all books from the Database and renders the page to list all books.
module.exports.bookList = function(req, res, next) {  
    debugger;
    Book.find((err, bookList) => {
        console.log(bookList);
        if(err)
        {
            return console.error(err);
        }
        else
        {
            res.render('book/list', {
                title: 'Book List', 
                books: bookList
            })            
        }
    });
}

// Gets a book by id and renders the details page.
module.exports.details = (req, res, next) => {
    
    let id = req.params.id;
    var newObjectId= new mongoose.Types.ObjectId(id);
   
    Book.findById(newObjectId).exec((err, bookToShow)=> {
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            console.log(bookToShow);
            //show the edit view
            res.render('book/details', {
                title: 'Book Details', 
                book: bookToShow
            })
        }
    });
}

// Renders the Add form using the add_edit.ejs template
module.exports.displayAddPage = (req, res, next) => {
    debugger;
    // ADD YOUR CODE HERE        
    Book.find((err, books) => {
        debugger;
        if (err) {
            return console.error(err);
        } else {
            res.render('book/add_edit', {
                title: 'New Book',
                book: books,
                Title: Book.Title,
                Description: Book.Description,
                Price: Book.Price,
                Author: Book.Author,
                Genre: Book.Genre
            });
        }
    });
}

// Processes the data submitted from the Add form to create a new book
module.exports.processAddPage = (req, res, next) => {
console.log(req);
    // ADD YOUR CODE HERE
    const new_book = new Book({
        Title: req.body.Title,
        Description: req.body.Description,
        Price: req.body.Price,
        Author: req.body.Author,
        Genre: req.body.Genre
    });
    Book.init();
    new_book.save().then(() => console.log('book saved !'));
    Book.find((err, books) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('book/list', {
                title: 'Book List',
                books: books
            });
        }
    });
    return res.redirect('/book/list');
}

// Gets a book by id and renders the Edit form using the add_edit.ejs template
module.exports.displayEditPage = (req, res, next) => {
    
    let id = req.params.id;
    var newObjectId= new mongoose.Types.ObjectId(id);
   
    // ADD YOUR CODE HERE
    Book.findById(newObjectId,(err, retBook) => {
        if (err) {
            return console.error(err);
        } else {
            console.log(retBook);
            res.render('book/add_edit', {
                title: "Edit Book",
                book: retBook,
                Title: Book.Title,
                Description: Book.Description,
                Price: Book.Price,
                Author: Book.Author,
                Genre: Book.Genre
            });
        }
    });
}

// Processes the data submitted from the Edit form to update a book
module.exports.processEditPage = (req, res, next) => {
    delete req.body._id;
    console.log(req.params.id);
    Book.updateOne(
        { _id:mongoose.Types.ObjectId(req.params.id) },
        { $set: req.body }
    ).then(() => {
        console.log('book saved !');
        return res.redirect('/book/list');
    });
   
}

// Deletes a book based on its id.
module.exports.performDelete = (req, res, next) => {
    
    // ADD YOUR CODE HERE

    Book.deleteOne({ _id:mongoose.Types.ObjectId(req.params.id) }).then(() => {
        console.log('book saved !');
        return res.redirect('/book/list');
    });
   
}