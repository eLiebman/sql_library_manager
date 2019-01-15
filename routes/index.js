var express = require('express');
var router = express.Router();
var Book = require('../models').Book;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});

/* GET all books */
router.get('/books', function(req, res, next) {
  Book.findAll().then( books => {
    res.render('index', { books: books, title:"Books" });
  }).catch( err => {
    res.send(500);
  });
});

/* New book entry form */
router.get('/books/new', function(req, res, next) {
  res.render("new_book", {book: Book.build(), title:"New Book"});
});

/* Create new book entry */
router.post('/books/new', function(req, res, next) {
  Book.create(req.body).then( book => {
    res.redirect(`/books`);
  }).catch( err => {
    if(err.name === "SequelizeValidationError"){
      res.render("new_book", {
        book: Book.build(req.body),
        title: "New Book",
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch( err => {
    res.send(500)
  });
});

/* Edit book page */
router.get('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then( book => {
    if(book) {
      res.render('edit_book', {book: book, title: book.title});
    } else {
      res.render('page_not_found', {title: "Page Not Found"});
    }
  }).catch( err => {
    res.send(500)
  });
});

/* Update book */
router.post('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then( book => {
    if(book) {
      return book.update(req.body)
    } else {
      res.render('page_not_found', {title: "Page Not Found"});
    }
  }).then(() => {
    res.redirect('/books');
  }).catch( err => {
    if(err.name === "SequelizeValidationError"){
      const book = Book.build(req.body);
      book.id = req.params.id;
      res.render("edit_book", {
        book: book,
        title: req.body.title,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch( err => {
    res.send(500)
  });
});

/* Delete Book */
router.post('/books/:id/delete', function(req, res, next) {
  Book.findById(req.params.id).then( book => {
    if(book) {
      return book.destroy();
    } else {
      res.render('page_not_found', {title: "Page Not Found"});
    }
  }).then(() => {
    res.redirect('/books');
  }).catch( err => {
    res.send(500);
  });
});

/* 404 Route */
router.get('*', function(req, res, next) {
  res.render('page_not_found', {title: "Page Not Found"});
});

module.exports = router;
