const { app } = require('express');
const { selectUsers } = require('../models/users-model.js');

exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((users) => res.status(200).send({ users }))
		.catch(next);
};
