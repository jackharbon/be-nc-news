const db = require('../db/connection.js');

exports.removeCommentById = (comment_id) => {
	return db.query('SELECT * FROM comments WHERE comment_id = $1;', [comment_id]).then((comments) => {
		if (comments.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Comment Id not found!' });
		}
		return db.query('DELETE FROM comments WHERE comments.comment_id = $1;', [comment_id]).then((comments) => {
			return comments.rows;
		});
	});
};
