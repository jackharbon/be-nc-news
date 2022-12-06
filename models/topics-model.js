const db = require('../db/connection.js');

exports.selectTopics = (topics) => {
  let queryString = `SELECT slug, description FROM topics`;
  queryString += ` ORDER BY slug ASC;`;

  return db.query(queryString).then((topics) => {
    return topics.rows;
  });
};
