var express = require('express');
var router = express.Router();
var Book = require('../models').Book

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/books');
});
/* GET all books */
router.get('/books', function(req, res, next) {
  Book.findAll().then( books => {
    res.render('index', { books: books, title:"Books" });
  });
});

/* New book entry form */
router.get('/books/new', function(req, res, next) {
  res.render('book_detail', {book: Book.build(), title:"New Book", route:req.path });
});
/* Create new book entry */
router.post('/books/new', function(req, res, next) {
  Book.create(req.body).then( book => {
    res.redirect(`/books`);
  })
});

/* Edit book page */
router.get('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then( book => {
    res.render('book_detail', {book: book, title: book.title, route:req.path });
  });
});
/* Update book */
router.put('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then( book => {
    return book.update(req.body)
  }).then(() => {
    res.redirect('/books');
  })
});

/* Delete Book */
router.post('/books/:id/delete', function(req, res, next) {
  Book.findById(req.params.id).then( book => {
    return book.destroy();
  }).then(() => {
    res.redirect('/books');
  });
});
module.exports = router;
