const url =
	process.env.NODE_ENV === 'production'
		? 'https://chat-app-69h8.onrender.com'
		: 'http://localhost:5000';
module.exports = url;
