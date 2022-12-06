const { app } = require('express');
const { removeCommentById } = require('../models/comments-model.js');

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => res.status(204).send())
		.catch((err) => next(err));
};
