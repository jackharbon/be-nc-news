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
exports.updateCommentById = (comment_id, inc_votes) => {
	if (!inc_votes || isNaN(inc_votes)) {
		return Promise.reject({ status: 400, msg: 'Missing vote!' });
	}
	return db.query(`UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`, [comment_id, inc_votes]).then((result) => {
		if (!result.rows.length) {
			return Promise.reject({ status: 404, msg: 'Comment Id not found!' });
		}
		return result.rows[0];
	});
};
