const db = require('../db/connection.js');

// ! GET TOPICS
exports.selectTopics = (topics) => {
	let queryString = `SELECT slug, description FROM topics`;
	queryString += ` ORDER BY slug DESC;`;

	return db.query(queryString).then((topics) => {
		return topics.rows;
	});
};
// ! POST NEW TOPIC
exports.insertTopic = (slug, description) => {
	if (slug.length === 0) {
		return Promise.reject({ status: 400, msg: 'Missing slug!' });
	} else if (description.length === 0) {
		return Promise.reject({ status: 400, msg: 'Missing description!' });
	}
	return db.query('SELECT * FROM topics WHERE slug = $1;', [slug]).then((topic) => {
		if (topic.rows.length !== 0) {
			return Promise.reject({ status: 404, msg: 'This topic already exists in database!' });
		}
		return db
			.query(
				`
			  INSERT INTO topics (slug, description) 
			  VALUES ($1, $2) RETURNING *;`,
				[slug, description]
			)
			.then((topic) => {
				return topic.rows[0];
			});
	});
};
// ! PATCH TOPIC BY SLUG
exports.updateTopicBySlug = (oldSlug, newSlug, newDescription) => {
	if (!newSlug && !newDescription) {
		return Promise.reject({ status: 400, msg: 'Nothing to change!' });
	}
	return db.query('SELECT * FROM topics WHERE slug = $1;', [oldSlug]).then((topic) => {
		if (topic.rows.length === 0) {
			return Promise.reject({ status: 404, msg: 'Invalid slug!' });
		}
		return db.query('SELECT * FROM topics WHERE slug = $1;', [newSlug]).then((topic) => {
			if (topic.rows.length !== 0) {
				return Promise.reject({ status: 404, msg: 'This topic already exists in database!' });
			}
			let queryString = `UPDATE topics SET`;

			const queryValues = [oldSlug];
			if (newSlug) {
				queryString += ` slug = $2`;
				queryValues.push(newSlug);
			} else {
				newSlug = oldSlug;
				queryString += ` slug = $2`;
				queryValues.push(newSlug);
			}
			if (newDescription) {
				queryString += `, description = $3`;
				queryValues.push(newDescription);
			}
			queryString += ` WHERE slug = $1 RETURNING *;`;
			return db.query(queryString, queryValues).then((topic) => {
				if (!topic.rows.length) {
					return Promise.reject({ status: 404, msg: 'Topic data was not updated!' });
				}
				return topic.rows[0];
			});
		});
	});
};
