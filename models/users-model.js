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
