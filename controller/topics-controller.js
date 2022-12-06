const { app } = require('express');
const { selectTopics } = require('../models/topics-model.js');

exports.getTopics = (req, res, next) => {
	const { topics } = req.body;
	selectTopics(topics)
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};
