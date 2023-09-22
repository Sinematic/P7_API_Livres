const Book = require('../models/Book');
const fs = require('fs');

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

exports.getBestRating = (req, res, next) => {

	Book.find()
		.then((books) => res.status(200).json(books.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3)))
		.catch(error => res.status(404).json({ error }));
};

exports.createBook = (req, res, next) => {
	
	const bookObject = JSON.parse(req.body.book);
	delete bookObject._id;
	delete bookObject._userId;
	delete bookObject.averageRating;
	
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get('host')}/images/opt${req.file.filename}`,
		averageRating: bookObject.ratings[0].grade
	});

	if (!book.imageUrl.endsWith('.undefined')) {
		book.save()
			.then(() => res.status(201).json({ message: 'Livre enregistré !' }))
			.catch(error => {
				fs.unlink(`images/${req.file.filename}`, (error) => {
					if (error) return res.status(400).json({ error });
				})
				return res.status(400).json({ error })
			});
	} else res.status(400).json({ error: "Problème rencontré avec l'image !" });
};

exports.modifyBook = (req, res, next) => {

	const bookObject = req.file ? { 
		...JSON.parse(req.body.book), 
		imageUrl: `${req.protocol}://${req.get('host')}/images/opt${req.file.filename}` 
	} : { ...req.body };

	delete bookObject._userId;

	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if(book.userId !== req.auth.userId) {
				return res.status(401).json({ message: "Non autorisé !" });
			} else {

				const oldImage = book.imageUrl; 
				
				Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id })
					.then(() => {

						if (req.file) {
							fs.unlink(`images/${oldImage.split('/images/')[1]}`, (error) => {
								if (!error) {
									return res.status(200).json({ message: "Livre modifié !" });
								}
							});
						} else res.status(200).json({ message: "Livre modifié !" });	
					})
					.catch(error => res.status(500).json({ error }));
			}
		})
		.catch(error => res.status(400).json({ error }));
};

exports.addRating = (req, res, next) => {

	Book.findOne({ _id: req.params.id })
		.then(book => {
			const ratings = book.ratings;
			const averageRating = book.averageRating;
	
			if (ratings.some(rating => rating.userId === req.auth.userId)) {
				res.status(400).json({ message: "Échec : l'utilisateur a déjà noté le livre !" });

			} else {

				let newAverageRating;

				if (ratings.length > 0) {
					newAverageRating = ((averageRating * ratings.length) + req.body.rating) / (ratings.length + 1);
				} else newAverageRating = req.body.rating;
				
			Book.updateOne(
				{ 
					_id: req.params.id 
				}, {
					$push: { ratings: { userId: req.auth.userId, grade: req.body.rating } },
					$set: { averageRating: newAverageRating.toFixed(2) }
				}
			)
				.then(() => {
					Book.findOne({ _id: req.params.id })
						.then((book) => res.status(200).json(book))
						.catch(error => res.status(404).json({ error }));
					})
				.catch(error => res.status(500).json({ error }));
			}
		})
		.catch(error => res.status(404).json({ error }));
};
  

exports.deleteOneBook = (req, res, next) => {

	Book.findOne({ _id : req.params.id })
		.then(book => {
			if (book.userId !== req.auth.userId) {
				res.status(401).json({ message: "Non autorisé !" });
			} else {
				const filename = book.imageUrl.split('/images/')[1];
				fs.unlink(`images/${filename}`, () => {
					Book.deleteOne({ _id: req.params.id})
						.then(() => res.status(200).json({ message: "Livre supprimé !" }))
						.catch(error => res.status(401).json({ error }));
				})
			}
		})
		.catch(error => res.status(500).json({ error }));
};