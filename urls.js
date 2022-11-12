const url =
	process.env.NODE_ENV === 'production'
		? 'https://web-rtc-project-five.vercel.app/'
		: 'http://localhost:3000';
module.exports = url;
