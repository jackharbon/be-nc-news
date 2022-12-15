const { app } = require('express');
const { selectTopics, insertTopic, updateTopicBySlug } = require('../models/topics-model.js');

// ! GET TOPICS
exports.getTopics = (req, res, next) => {
	const { topics } = req.body;
	selectTopics(topics)
		.then((topics) => {
			res.status(200).send({ topics });
		})
		.catch(next);
};
// ! POST NEW TOPIC
exports.postTopic = (req, res, next) => {
	const { slug, description } = req.body;
	insertTopic(slug, description)
		.then((topic) => {
			res.status(201).send({ topic });
		})
		.catch(next);
};
// ! PATCH TOPIC BY SLUG
exports.patchTopicBySlug = (req, res, next) => {
	const oldSlug = req.params.slug;
	const newSlug = req.body.slug;
	const newDescription = req.body.description;
	updateTopicBySlug(oldSlug, newSlug, newDescription)
		.then((topic) => {
			res.status(200).send({ topic });
		})
		.catch(next);
};
