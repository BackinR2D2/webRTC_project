require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000;

app.use(require('cors')());

server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})