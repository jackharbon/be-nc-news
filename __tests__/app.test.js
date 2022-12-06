const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data');
const app = require('../app.js');
const db = require('../db/connection.js');
const articles = require('../db/data/test-data/articles.js');
const { expect } = require('@jest/globals');

beforeEach(() => {
	return seed(testData);
});
afterAll(() => {
	db.end();
});
describe('GET /api/topics', () => {
	test('GET: 200 -> returns array type object', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body).toHaveProperty('topics');
				expect(Array.isArray(body.topics)).toBe(true);
			});
	});
	test('GET: 200 -> array contains object properties including slug and description', () => {
		return request(app)
			.get('/api/topics')
			.expect(200)
			.then(({ body }) => {
				expect(body.topics.length).toBe(3);
				body.topics.forEach((topic) => {
					expect(topic).toHaveProperty('slug');
					expect(topic).toHaveProperty('description');
					expect(topic).toMatchObject({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});
describe('GET /api/articles', () => {
	test('GET: 200 -> returns array type object', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body).toHaveProperty('articles');
				expect(Array.isArray(body.articles)).toBe(true);
			});
	});
	test('GET: 200 -> array contains object properties including author and comment_count', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles[0].comment_count).toBe('2');
				expect(body.articles.length).toBe(12);
				body.articles.forEach((article) => {
					expect(article).toMatchObject({
						comment_count: expect.any(String),
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
					});
				});
			});
	});
	test('GET: 200 -> array is sorted DESC by created_at by default', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('created_at', { descending: true });
			});
	});
	test('GET: 200 -> can sort DESC by title', () => {
		return request(app)
			.get('/api/articles?sort_by=title')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('title', { descending: true });
			});
	});
	test('GET: 200 -> can sort DESC request by topic', () => {
		return request(app)
			.get('/api/articles?sort_by=topic')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('topic', { descending: true });
			});
	});
	test('GET: 200 -> can sort DESC request by author', () => {
		return request(app)
			.get('/api/articles?sort_by=author')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('author', { descending: true });
			});
	});
	test('GET: 200 -> can sort DESC request by votes', () => {
		return request(app)
			.get('/api/articles?sort_by=votes')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('votes', { descending: true });
			});
	});
	test('GET: 400 -> invalid sort query', () => {
		return request(app)
			.get('/api/articles?sort_by=title; DROP TABLE articles')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid query!');
			});
	});
	test('GET: 200 -> can filter articles by given topic', () => {
		return request(app)
			.get('/api/articles?topic=cats')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles.length).toBe(1);
				body.articles.forEach((article) => {
					expect(article.topic).toBe('cats');
				});
			});
	});
	test('GET: 404 -> invalid topic query', () => {
		return request(app)
			.get('/api/articles?topic=dogs')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid topic query!');
			});
	});
	test('GET: 200 -> array is sorted by ASC created_at while ?order=asc', () => {
		return request(app)
			.get('/api/articles?order=asc')
			.expect(200)
			.then(({ body }) => {
				expect(body.articles).toBeSortedBy('created_at', { descending: false });
			});
	});
	test('GET: 400 -> invalid order query', () => {
		return request(app)
			.get('/api/articles?order=test;')
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid query!');
			});
	});
	test('GET: 404 -> specified URL does not exist', () => {
		return request(app)
			.get('/api/url_do_not_exists')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('Invalid URL!');
			});
	});
});
describe('GET: /api/articles/:article_id', () => {
	test('GET: 200 -> returns a single article', () => {
		const articleId = 1;
		return request(app)
			.get(`/api/articles/${articleId}`)
			.expect(200)
			.then((response) => {
				expect(response.body.article).toMatchObject({
					article_id: articleId,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T16:11:00.000Z',
					votes: 100,
				});
			});
	});
	test('GET: 404 -> returns an appropriate error message when given a valid but non-existent id', () => {
		const articleId = 999;
		return request(app)
			.get(`/api/articles/${articleId}`)
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Article Id not found!');
			});
	});
	test('GET: 400 -> returns an appropriate and error message when given an invalid id', () => {
		const articleId = 'random-string';
		return request(app)
			.get(`/api/articles/${articleId}`)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid URL!');
			});
	});
});
describe('GET: /api/articles/:article_id/comments', () => {
	test('GET: 200 -> returns an empty array if article does not have comments', () => {
		const articleId = 2;
		return request(app)
			.get(`/api/articles/${articleId}/comments`)
			.expect(200)
			.then((response) => {
				expect(response.body.comments).toEqual(expect.any(Array));
			});
	});
	test('GET: 200 -> returns an array of comments belonging to a single article', () => {
		const articleId = 1;
		return request(app)
			.get(`/api/articles/${articleId}/comments`)
			.expect(200)
			.then((response) => {
				expect(response.body.comments).toEqual(expect.any(Array));
				expect(Object.keys(response.body.comments[0])).toEqual(
					expect.arrayContaining(['body', 'votes', 'author', 'article_id', 'created_at'])
				);
				response.body.comments.forEach((comment) => {
					expect(comment.article_id).toBe(1);
				});
			});
	});
	test('GET: 404 -> returns an appropriate and error message when given a valid but non-existent id', () => {
		const articleId = 999;
		return request(app)
			.get(`/api/articles/${articleId}/comments`)
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Article Id not found!');
			});
	});
	test('GET: 400 -> returns an appropriate and error message when given an invalid id', () => {
		const articleId = 'random-string';
		return request(app)
			.get(`/api/articles/${articleId}/comments`)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid URL!');
			});
	});
});
describe('POST: /api/articles/:articleId/comments', () => {
	test('POST: 201 -> Responds with a new comment.', () => {
		const articleId = 1;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'butter_bridge',
			})
			.expect(201)
			.then(({ body }) => {
				expect(body).toHaveProperty('comment');
				expect(body.comment.body).toBe('Testing POST comment for article Id');
				expect(body.comment.article_id).toBe(articleId);
			});
	});
	test('POST: 201 -> the comment object being returned matches the complete structure of comments already in the database', () => {
		const articleId = 1;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'butter_bridge',
			})
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toMatchObject({
					body: expect.any(String),
					votes: expect.any(Number),
					author: expect.any(String),
					article_id: expect.any(Number),
					created_at: expect.any(String),
				});
			});
	});
	test('POST: 201 -> App ignore unnecessary request body keys and responds with a new comment.', () => {
		const articleId = 1;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'butter_bridge',
				votes: 500,
			})
			.expect(201)
			.then(({ body }) => {
				expect(body).toHaveProperty('comment');
				expect(body.comment.body).toBe('Testing POST comment for article Id');
				expect(body.comment.article_id).toBe(articleId);
				expect(body.comment.votes).toBe(0);
			});
	});
	test('POST: 400 -> Missing body', () => {
		const articleId = 1;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: '',
				username: 'butter_bridge',
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Missing comment!');
			});
	});
	test('POST: 400 -> Missing username', () => {
		const articleId = 1;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: '',
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid username!');
			});
	});
	test('POST: 400 -> Invalid username', () => {
		const articleId = 1;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'no_valid_username',
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid username!');
			});
	});
	test('POST: 400 -> sends an appropriate and error message when given an invalid id', () => {
		const articleId = 'random-string';
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'butter_bridge',
			})
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid URL!');
			});
	});
	test('POST: 404 -> sends an appropriate and error message when given a valid but non-existent article id', () => {
		const articleId = 999;
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'butter_bridge',
			})
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Article Id not found!');
			});
	});
	test('POST: 404 -> sends an appropriate and error message when given an invalid id', () => {
		const articleId = 'random-string/99/jhgfjfjhgg';
		return request(app)
			.post(`/api/articles/${articleId}/comments`)
			.send({
				body: 'Testing POST comment for article Id',
				username: 'butter_bridge',
			})
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid URL!');
			});
	});
});
describe('PATCH: /api/articles/:article_id', () => {
	test('PATCH: 200 -> responds with the added new vote to the votes in article', () => {
		const articleId = 1;
		const updatedVotes = { inc_votes: 1 };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T16:11:00.000Z',
					votes: 101,
				});
			});
	});
	test('PATCH: 200 -> responds with votes taken away from votes in article', () => {
		const articleId = 1;
		const updatedVotes = { inc_votes: -100 };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T16:11:00.000Z',
					votes: 0,
				});
			});
	});
	test('PATCH: 200 -> responds with votes taken away from votes in article below 0', () => {
		const articleId = 1;
		const updatedVotes = { inc_votes: -200 };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(200)
			.then(({ body }) => {
				expect(body.article).toEqual({
					article_id: 1,
					title: 'Living in the shadow of a great man',
					topic: 'mitch',
					author: 'butter_bridge',
					body: 'I find this existence challenging',
					created_at: '2020-07-09T16:11:00.000Z',
					votes: -100,
				});
			});
	});
	test('PATCH: 400 -> request body that does not have inc_votes', () => {
		const articleId = 1;
		const updatedVotes = { inc_votes: null };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Missing vote!');
			});
	});
	test('PATCH: 400 -> request body that has inc_votes set to a value that is not a number', () => {
		const articleId = 1;
		const updatedVotes = { inc_votes: 'votes has no number' };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Missing vote!');
			});
	});
	test('PATCH: 404 -> responds an appropriate an error message when given a valid but non-existent article id', () => {
		const articleId = 999;
		const updatedVotes = { inc_votes: 1 };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(404)
			.then((response) => {
				expect(response.body.msg).toBe('Article Id not found!');
			});
	});
	test('PATCH: 400 -> responds an appropriate an error message when given an invalid id', () => {
		const articleId = 'random-string';
		const updatedVotes = { inc_votes: 1 };
		return request(app)
			.patch(`/api/articles/${articleId}`)
			.send(updatedVotes)
			.expect(400)
			.then((response) => {
				expect(response.body.msg).toBe('Invalid URL!');
			});
	});
});
describe('GET /api/users', () => {
	test('GET: 200 -> returns array type object', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				expect(body).toHaveProperty('users');
				expect(Array.isArray(body.users)).toBe(true);
			});
	});
	test('GET: 200 -> array contains object properties including username, name, avatar_url', () => {
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				expect(body.users.length).toBe(4);
				body.users.forEach((user) => {
					expect(user).toHaveProperty('username');
					expect(user).toHaveProperty('name');
					expect(user).toHaveProperty('avatar_url');
					expect(user).toMatchObject({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
			});
	});
});
describe('DELETE /api/comment/comment_id', () => {
	test("DELETE: 204 -> response 204 if it's successful", () => {
		return request(app).delete('/api/comments/1').expect(204);
	});
	test('DELETE: 404 -> responds an appropriate an error message when given a valid but non-existent comment id', () => {
		const commentId = 999;
		return request(app)
			.delete(`/api/comments/${commentId}`)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Comment Id not found!');
			});
	});
	test('DELETE: 404 -> responds an appropriate an error message when given an invalid id', () => {
		const commentId = 'random-string/99/jhgfjfjhgg';
		return request(app)
			.delete(`/api/comments/${commentId}`)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('Invalid URL!');
			});
	});
	test('DELETE: 400 -> responds an appropriate an error message when given an invalid id', () => {
		const commentId = 'random-string';
		return request(app)
			.delete(`/api/comments/${commentId}`)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('Invalid URL!');
			});
	});
});
describe('GET /api json', () => {
	test(`GET: 200 -> returns json`, () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body }) => {
				expect(body).toHaveProperty('GET /api');
				expect(body).toHaveProperty('GET /api/topics');
				expect(body).toHaveProperty('GET /api/articles');
			});
	});
});
