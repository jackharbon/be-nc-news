const { app } = require('express');
const { selectUsers, insertUser, selectUserByUsername, updateUserByUsername, removeUserByUsername } = require('../models/users-model.js');

// ! GET ALL USERS
exports.getUsers = (req, res, next) => {
	selectUsers()
		.then((users) => res.status(200).send({ users }))
		.catch(next);
};
// ! POST USER
exports.postUser = (req, res, next) => {
	const { username, name, avatar_url } = req.body;
	insertUser(username, name, avatar_url)
		.then((user) => {
			res.status(201).send({ user });
		})
		.catch(next);
};
// ! GET USER BY USERNAME
exports.getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	selectUserByUsername(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};
// ! PATCH USER BY USERNAME
exports.patchUserByUsername = (req, res, next) => {
	const { username } = req.params;
	const { name, avatar_url } = req.body;
	updateUserByUsername(username, name, avatar_url)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};
// ! DELETE USER BY USERNAME
exports.deleteUserByUsername = (req, res, next) => {
	const { username } = req.params;
	removeUserByUsername(username)
		.then(() => res.status(204).send())
		.catch((err) => next(err));
};
