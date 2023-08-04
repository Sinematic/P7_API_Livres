const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = (req, res, next) => {

	User.findOne({ mail: req.body.mail })
		.then(user => {
			if (user == null) {
				res.status(401).json({ message: "Identifiants incorrects !" });
			} else { 
				bcrypt.compare(req.body.password, user.password)
				.then(valid => {
					if(valid) {
						res.status(200).json({
							userId: user._id,
							token: jwt.sign(
								{ userId: user._id },
								'RANDOM_TOKEN_SECRET',
								{ expiresIn: '24h' }
							)});
					} else res.status(401).json({ message: "Identifiants incorrects !" })
				})
				.catch(res.status(500).json({ message: "Identifiant" }))
			}
		})
		.catch(error => res.status(500).json({ error }));
};

exports.signup = (req, res, next) => {

	bcrypt.hash(req.body.password, 10)
		.then(hash => {
			
			const user = new User({ 
				mail: req.body.mail,
				password: hash
			});
			user.save()
				.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
				.catch(error => res.status(400).json({ error }));
		})
		.catch(error => res.status(500).json({ error }));
};