const { app } = require('express');
const {
	selectArticles,
	selectArticleById,
	selectCommentsByArticleId,
	insertCommentByArticle,
	updateArticleById,
} = require('../models/articles-model.js');

exports.getArticles = (req, res, next) => {
	const { sort_by, topic, order } = req.query;
	selectArticles(sort_by, topic, order)
		.then((articles) => {
			return res.status(200).send({ articles });
		})
		.catch(next);
};
exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
exports.postCommentByArticle = (req, res, next) => {
	const { article_id } = req.params;
	const { body } = req.body;
	const { username } = req.body;
	insertCommentByArticle(article_id, body, username)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};
exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	updateArticleById(article_id, inc_votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
