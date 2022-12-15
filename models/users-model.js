const db = require('../db/connection.js');

// ! GET ALL USERS
exports.selectUsers = () => {
	let queryString = `
	SELECT * FROM users
	`;
	queryString += ` ORDER BY username DESC;`;
	return db.query(queryString).then((users) => {
		return users.rows;
	});
};
// ! POST NEW USER
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
// ! GET USER BY USERNAME
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
// ! PATCH USER BY USERNAME
exports.updateUserByUsername = (username, name, avatar_url) => {
	return db.query('SELECT * FROM users WHERE username = $1;', [username]).then((user) => {
		if (user.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Invalid username!' });
		}
		if (!name && !avatar_url) {
			return Promise.reject({ status: 400, msg: 'Nothing to change!' });
		}

		let queryString = `UPDATE users SET`;
		const queryValues = [username];
		if (name) {
			queryString += ` name = $2,`;
			queryValues.push(name);
		}
		if (avatar_url) {
			queryString += ` avatar_url = $3`;
			queryValues.push(avatar_url);
		}
		queryString += ` WHERE username = $1 RETURNING *;`;
		return db.query(queryString, queryValues).then((user) => {
			if (!user.rows.length) {
				return Promise.reject({ status: 404, msg: 'User data was not updated!' });
			}
			return user.rows[0];
		});
	});
};
// ! DELETE USER BY USERNAME
exports.removeUserByUsername = (username) => {
	return db.query('SELECT * FROM users WHERE username = $1;', [username]).then((user) => {
		if (user.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Username not found!' });
		}
		return db.query('DELETE FROM users WHERE users.username = $1;', [username]).then((user) => {
			return user.rows;
		});
	});
};
