const Book = require('../models/Book');

exports.getAllBooks = (req, res, next) => {

	Book.find()
		.then((books) => res.status(200).json(books))
		.catch(error => res.status(404).json({ error }));
};

exports.getOneBook = (req, res, next) => {

	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch(error => res.status(404).json({ error }));
};

exports.createBook = (req, res, next) => {
	
	const bookObject = JSON.parse(req.body.book);
	delete bookObject._id;
	delete bookObject._userId;
	console.log(`${req.protocol}://${req.get('host')}/images/${req.file.filename}`)
	
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
	});

	console.log(book)

	book.save()
	.then(() => { res.status(201).json({message: 'Livre enregistré !'})})
	.catch(error => { 
		console.log("erreur ici")
		res.status(400).json( { error })})
};

exports.deleteOneBook = (req, res, next) => {

	Book.deleteOne({ _id : req.params.id })
		.then(req => {
			if (req.body.userId !== req.auth.userId) {
				res.status(401).json({ message: "Non autorisé !" });
			} else {
				res.status(200).json({ message : "Livre supprimé !" });
			}
		});
};

exports.modifyBook = (req, res, next) => {

	Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(req => {
			if(req.body.userId !== req.auth.userId) {
				res.status(401).json({ message: "Non autorisé !" });
			} else {
				res.status(200).json({ message: "Livre modifié !" });
			}
		});
};