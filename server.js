require('dotenv').config();
const url = require('./urls');
const express = require('express');
const app = express();
app.use(require('cors')());
const port = process.env.PORT || 5000;
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: url,
    },
    rememberTransport: false, 
    transports: ['websocket', 'polling'],
});

const hp = require('./routes/hp');
const { addUser, getUser, deleteUser, getUsers } = require('./users');
app.use(hp);

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("join-room", ({name, room}, callback) => {
      const { user, error } = addUser(socket.id, name, room)
      if (error) {
        return console.log(error);
      }
      socket.join(user.room)
      socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
      io.in(room).emit('users', getUsers(room))
    })

    socket.on('sendMessage', async obj => {
      // const user = getUser(socket.id);
      await io.to(obj.room).emit('message', { user: obj.name, text: obj.msg });
    })
    
    socket.on("snap-image", async ({imageSrc, room}) => {
      // const user = getUser(socket.id);
      await io.to(room).emit('image', { imageSrc });
    })

    socket.on("disconnect", () => {
      console.log("User disconnected");
      const user = deleteUser(socket.id)
      if (user) {
          io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
          io.in(user.room).emit('users', getUsers(user.room))
      }
    })
});
  
server.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
})