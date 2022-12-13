const { app } = require('express');
const { updateCommentById, removeCommentById } = require('../models/comments-model.js');

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => res.status(204).send())
		.catch((err) => next(err));
};
exports.patchCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;
	updateCommentById(comment_id, inc_votes)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};
