const express = require('express');
const router = express.Router();

const Book = require('../models/Book');

router.get('/', (req, res, next) => {

	Book.find()
		.then((books) => res.status(200).json(books))
		.catch(error => res.status(404).json({error}));
});

router.post('/', (req, res, next) => {

	delete req.body.id;
	const book = new Book ({ ...req.body});

	book.save()
		.then(() => res.status(201).json({message : "Livre enregistré !"}))
		.catch((error) => res.status(400).json({error}));
});

router.delete('/:id', (req, res, next) => {

	Book.deleteOne({ _id : req.params.id })
		.then(() => res.status(200).json({ message : "Livre supprimé !"}))
		.catch(error => res.status(204).json({ error }));
});

/*
router.delete('/api/books', (req, res, next) => {

	Book.deleteMany()
		.then();
});*/

router.put('/:id', (req, res, next) => {

	Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message : "Livre modifié !" }))
		.catch((error) => res.status(204).json({ error }));

});

module.exports = router;