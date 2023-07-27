const bcrypt = require('bcrypt');
const User = require('../models/User');

exports.login = (req, res, next) => {

	User.findOne({ mail: req.body.mail })
		.then((users) => res.status(200).json(users))
		.catch(error => res.status(404).json({error}));
};

exports.signup = (req, res, next) => {

	bcrypt.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User ({ 
				mail: req.body.mail,
				password: hash,
				signedUp: Date()
			});

			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};