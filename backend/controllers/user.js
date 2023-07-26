const User = require('../models/User');

exports.getUser = (req, res, next) => {

	User.find()
		.then((users) => res.status(200).json(users))
		.catch(error => res.status(404).json({error}));
};

exports.createUser = (req, res, next) => {

	const user = new User ({ ...req.body});

	user.save()
		.then(() => res.status(201).json({ message: "Utilisateur créé !"}))
		.catch(error => res.status(400).json({error}));
};