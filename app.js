const express = require('express');
const { getTopics } = require('./controller/topics-controller.js');
const { catchAll, errorPSQL, handleCustomErrors } = require('./controller/errors-controller');
const {
	getArticles,
	getArticleById,
	getCommentsByArticleId,
	postCommentByArticle,
	patchArticleById,
} = require('./controller/articles-controller.js');
const { getUsers } = require('./controller/users-controller.js');
const { deleteCommentById } = require('./controller/comments-controller.js');
const { getApis } = require('./controller/apis-controller.js');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
	res.status(200).send({ msg: 'server up and running' });
});
app.get('/api', getApis);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/users', getUsers);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticle);
app.patch('/api/articles/:article_id', patchArticleById);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.all('/*', (req, res) => {
	res.status(404).send({ msg: 'Invalid URL!' }).end();
});

app.use(handleCustomErrors);
app.use(errorPSQL);
app.use(catchAll);

module.exports = app;
