const { app } = require('express');
const {
	selectArticles,
	selectArticleById,
	selectCommentsByArticleId,
	insertCommentByArticle,
	updateArticleById,
	insertArticle,
	removeArticleById,
} = require('../models/articles-model.js');

// ! GET ALL ARTICLES ORDER & QUERY
exports.getArticles = (req, res, next) => {
	const { sort_by, topic, order } = req.query;
	selectArticles(sort_by, topic, order)
		.then((articles) => {
			return res.status(200).send({ articles });
		})
		.catch(next);
};
// ! POST NEW ARTICLE
exports.postArticle = (req, res, next) => {
	const { title, topic, author, body, img_url } = req.body;
	insertArticle(title, topic, author, body, img_url)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};
// ! GET ARTICLE BY ID
exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
// ! PATCH ARTICLE VOTES BY ARTICLE ID
exports.patchArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	updateArticleById(article_id, inc_votes)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
// ! DELETE ARTICLE BY ID
exports.deleteArticleById = (req, res, next) => {
	const { article_id } = req.params;
	removeArticleById(article_id)
		.then(() => res.status(204).send())
		.catch((err) => next(err));
};
// ! GET COMMENTS BY ARTICLE ID
exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};
// ! POST NEW COMMENT BY ARTICLE ID
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
