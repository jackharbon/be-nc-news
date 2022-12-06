const db = require('../db/connection.js');

exports.selectArticles = (sort_by = 'created_at', topic, order = 'desc') => {
	const validColumns = ['title', 'topic', 'author', 'body', 'created_at', 'votes'];
	const validTopics = ['mitch', 'cats', 'paper'];
	const validOrder = ['desc', 'asc'];

	if (!validColumns.includes(sort_by) || (order && !validOrder.includes(order))) {
		return Promise.reject({ status: 400, msg: 'Invalid query!' });
	}
	if (topic && !validTopics.includes(topic)) {
		return Promise.reject({ status: 404, msg: 'Invalid topic query!' });
	}

	let queryString = `
	SELECT COUNT(comments.article_id) AS comment_count, users.username AS author, articles.title, articles.img_url, articles.article_id, articles.topic, articles.created_at, articles.votes
	FROM articles
	LEFT JOIN users ON articles.author = users.username
	LEFT JOIN  comments ON comments.article_id = articles.article_id
	`;
	const queryValues = [];
	if (topic) {
		queryString += ` WHERE articles.topic = $1`;
		queryValues.push(topic);
	}
	queryString += ` GROUP BY users.username, articles.article_id, articles.title,  articles.img_url, articles.topic, articles.created_at, articles.votes ORDER BY ${sort_by} ${order};`;
	return db.query(queryString, queryValues).then((articles) => {
		return articles.rows;
	});
};

exports.selectArticleById = (article_id) => {
	return db
		.query(
			`
	SELECT 
	users.username AS author, articles.title, articles.article_id, articles.body,   articles.img_url, articles.topic, articles.created_at, articles.votes
	FROM articles
	LEFT JOIN users ON articles.author = users.username
	WHERE articles.article_id = $1;`,
			[article_id]
		)
		.then((articles) => {
			if (!articles.rows.length) {
				return Promise.reject({ status: 404, msg: 'Article Id not found!' });
			}
			return articles.rows[0];
		});
};
exports.selectCommentsByArticleId = (article_id) => {
	return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]).then((comments) => {
		if (comments.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Article Id not found!' });
		}
		return db.query('SELECT * FROM comments WHERE comments.article_id = $1;', [article_id]).then((comments) => {
			return comments.rows;
		});
	});
};
exports.insertCommentByArticle = (article_id, body, author) => {
	if (body.length === 0) {
		return Promise.reject({ status: 400, msg: 'Missing comment!' });
	}
	return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id]).then((comments) => {
		if (comments.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Article Id not found!' });
		}
		return db
			.query(
				`
	  INSERT INTO comments (article_id, body, author) 
	  VALUES ($1, $2, $3) RETURNING *;`,
				[article_id, body, author]
			)
			.then((comment) => {
				return comment.rows[0];
			});
	});
};
exports.updateArticleById = (article_id, inc_votes) => {
	if (!inc_votes || isNaN(inc_votes)) {
		return Promise.reject({ status: 400, msg: 'Missing vote!' });
	}
	return db.query('UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *', [article_id, inc_votes]).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({ status: 404, msg: 'Article Id not found!' });
		}
		return result.rows[0];
	});
};
