const express = require('express');
const { getTopics } = require('./controller/topics-controller.js');
const { catchAll, errorPSQL, handleCustomErrors } = require('./controller/errors-controller');
const {
	getArticles,
	getArticleById,
	getCommentsByArticleId,
	postCommentByArticle,
	patchArticleById,
	postArticle,
} = require('./controller/articles-controller.js');
const { getUsers, postUser, getUserByUsername, patchUserByUsername } = require('./controller/users-controller.js');
const { deleteCommentById, patchCommentById } = require('./controller/comments-controller.js');
const { getApis } = require('./controller/apis-controller.js');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
// ! GET ALL APIs
app.get('/api', getApis);
// * --------- ARTICLES -------
// ! GET ALL ARTICLES ORDER & QUERY
app.get('/api/articles', getArticles);
// ! POST NEW ARTICLE
app.post('/api/articles', postArticle);
// ! GET ARTICLE BY ID
app.get('/api/articles/:article_id', getArticleById);
// ! PATCH ARTICLE VOTES BY ARTICLE ID
app.patch('/api/articles/:article_id', patchArticleById);
// ! GET COMMENTS BY ARTICLE ID
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
// ! POST NEW COMMENT BY ARTICLE ID
app.post('/api/articles/:article_id/comments', postCommentByArticle);
// * --------- COMMENTS -------
// ! PATCH COMMENTS VOTES
app.patch('/api/comments/:comment_id', patchCommentById);
// ! DELETE COMMENT BY ID
app.delete('/api/comments/:comment_id', deleteCommentById);
// * --------- TOPICS -------
// ! GET TOPICS
app.get('/api/topics', getTopics);
// * --------- USERS -------
// ! GET ALL USERS
app.get('/api/users', getUsers);
// ! POST NEW USER
app.post('/api/users', postUser);
// ! GET USER BY USERNAME
app.get('/api/users/:username', getUserByUsername);
// ! PATCH USER BY USERNAME
// app.patch('/api/users/:username', patchUserByUsername);

app.get('/api/health', (req, res) => {
	res.status(200).send({ msg: 'server up and running' });
});

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Invalid URL!' }).end();
});

app.use(handleCustomErrors);
app.use(errorPSQL);
app.use(catchAll);

module.exports = app;
