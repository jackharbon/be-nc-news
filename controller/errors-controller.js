exports.errorPSQL = (err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Invalid Text Representation (URL)!' });
	} else if (err.code == '23502') {
		res.status(400).send({ msg: 'Not Null Violation!' });
	} else if (err.code == '23503') {
		res.status(400).send({ msg: 'Foreign Key Violation!' });
	} else {
		next(err);
	}
};

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};

exports.catchAll = (err, req, res, next) => {
	console.log('==== Errors Controller: UNHANDLED ERROR! ====', err);
	res.status(500).send({ msg: 'Internal Server Error' });
};
