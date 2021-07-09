const url = process.env.NODE_ENV === 'production' ? 'https://' : 'http://localhost:3000';
module.exports = url;