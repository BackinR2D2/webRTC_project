require('dotenv').config();
const express = require('express');
const app = express();
app.use(require('cors')());
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
      origin: 'http://localhost:3000',
    },
    maxHttpBufferSize: 1e8,
    pingTimeout: 30000,
    pingInterval: 30000,
});

const hp = require('./routes/hp');
const { addUser, getUser, deleteUser, getUsers } = require('./users');
const users = {};
const socketToRoom = {};
app.use(hp);
const port = process.env.PORT || 5000;

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

    socket.on('sendMessage', obj => {
      const user = getUser(socket.id);
      io.to(obj.room).emit('message', { user: user.name, text: obj.msg });
    })
    
    socket.on("snap-image", imageSrc => {
      const user = getUser(socket.id);
      io.to(user.room).emit('image', { imageSrc });
    })

    socket.on("sending signal", payload => {
      
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
      
    });

    socket.on("returning signal", payload => {
      
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
      
    });

    socket.on("init", room => {
      if (users[room]) {
          const length = users[room].length;
          if (length === 4) {
              socket.emit("room full");
              return;
          }
          users[room].push(socket.id);
      } else {
          users[room] = [socket.id];
      }
      socketToRoom[socket.id] = room;
      const usersInThisRoom = users[room].filter(id => id !== socket.id);
      socket.emit("all users", usersInThisRoom);
      
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