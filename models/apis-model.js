const db = require('../db/connection.js');
const { readFile } = require('fs/promises');

exports.selectApis = async (cb) => {
	const result = await readFile('endpoints.json');
	return JSON.parse(result);
};
