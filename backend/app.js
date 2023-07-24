const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

mongoose.connect('mongodb+srv://node-api-unknown-user:IYQPlZBGR4sdGUJM@cluster0.edtwz6b.mongodb.net/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
		.then(() => console.log('Connexion à MongoDB réussie !'))
		.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


// CRUD '/api/books'

app.get('/api/books', (req, res, next) => {

	Book.find()
		.then((books) => res.status(201).json(books))
		.catch(error => res.status(400).json({error}));
});

app.post('/api/books', (req, res, next) => {

	delete req.body.id;
	const book = new Book ({ ...req.body});

	book.save()
		.then(() => res.status(201).json({message : "Livre enregistré !"}))
		.catch((error) => res.status(400).json({error}));
})

app.delete('/api/books/:id', (req, res, next) => {

	Book.deleteOne({ _id : req.params.id })
		.then(() => res.status(200).json({ message : "Livre supprimé !"}))
		.catch(error => res.status(400).json({ error }))
})

/*
app.delete('/api/books', (req, res, next) => {

	Book.deleteMany()
		.then();
});*/

app.put('/api/books/:id', (req, res, next) => {

	Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message : "Livre modifié !" }))
		.catch((error) => res.status(400).json({ error }));

});

// CRUD '/api/users'

app.get('/api/users', (req, res, next) => {

	User.find()
		.then((users) => res.status(201).json(users))
		.catch(error => res.status(400).json({error}));
})

app.post('/api/users', (req, res, next) => {

	const user = new User ({ ...req.body});

	user.save()
		.then(() => res.status(201).json({ message: "Utilisateur créé !"}))
		.catch(error => res.status(400).json({error}))
})

module.exports = app;