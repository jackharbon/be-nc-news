const db = require('../db/connection.js');

exports.selectUsers = () => {
	let queryString = `
	SELECT * FROM users
	`;
	queryString += ` ORDER BY username DESC;`;
	return db.query(queryString).then((users) => {
		return users.rows;
	});
};
exports.insertUser = (username, name, avatar_url) => {
	return db
		.query(
			`
SELECT * FROM users WHERE username = $1;`,
			[username]
		)
		.then((user) => {
			if (!user.rows.length) {
				if (username.length === 0) {
					return Promise.reject({ status: 400, msg: 'Missing username!' });
				} else if (name.length === 0) {
					return Promise.reject({ status: 400, msg: 'Missing name!' });
				} else if (avatar_url.length === 0) {
					return Promise.reject({ status: 400, msg: 'Missing avatar link!' });
				}
				return db
					.query(
						`
				  INSERT INTO users (username, name, avatar_url) 
				  VALUES ($1, $2, $3) RETURNING *;`,
						[username, name, avatar_url]
					)
					.then((user) => {
						return user.rows[0];
					});
			}
			return Promise.reject({ status: 400, msg: 'Username already registered!' });
		});
};
exports.selectUserByUsername = (username) => {
	return db
		.query(
			`
	SELECT * FROM users WHERE username = $1;`,
			[username]
		)
		.then((users) => {
			if (!users.rows.length) {
				return Promise.reject({ status: 404, msg: 'Username not found!' });
			}
			return users.rows[0];
		});
};
