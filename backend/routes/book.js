const express = require('express');
const router = express.Router();

const Book = require('../models/Book');
const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', bookCtrl.createBook);
router.delete('/:id', bookCtrl.deleteOneBook);
router.put('/:id', bookCtrl.modifyBook);

module.exports = router;