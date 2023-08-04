const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const bookCtrl = require('../controllers/book');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.post('/', auth, bookCtrl.createBook);
router.delete('/:id', auth, bookCtrl.deleteOneBook);
router.put('/:id', auth, bookCtrl.modifyBook);

module.exports = router;