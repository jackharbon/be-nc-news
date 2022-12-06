const { app } = require('express');
const { selectApis } = require('../models/apis-model.js');

exports.getApis = async (req, res, next) => {
	try {
		const apis = await selectApis();
		res.status(200).json(apis);
	} catch (err) {
		next(err);
	}
};
