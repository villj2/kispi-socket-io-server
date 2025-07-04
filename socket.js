const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

module.exports = function initializeSocketIO(server) {
  const io = new Server(server, {
    connectionStateRecovery: {}, // Optional: For reconnection logic
    cors: {
      origin: ["http://localhost:3000", "https://admin.socket.io"], // Add allowed origins
      methods: ["GET", "POST"], // HTTP methods
      credentials: true, // Include credentials for authentication
    },
    pingInterval: 2000,
    pingTimeout: 4000
  });

  const adminNamespace = io.of("/admin");
  adminNamespace.on("connection", (socket) => {
    console.log("Admin connected");
  });


  io.on('connection', (socket) => {

    const token = socket.handshake.query.token;
    const custom = socket.handshake.query.custom;
    const room = socket.handshake.query.room;

    console.log('a user connected with id: ' + socket.id + ', room: ' + room);

    socket.join(room);

    // inform joined client about other clients in room
    const clientsInRoom = io.sockets.adapter.rooms.get(room);

    if (clientsInRoom) {
      const clientIds = Array.from(clientsInRoom).filter(id => id !== socket.id);
      socket.emit('clients in room', clientIds);
    } else {
      socket.emit('clients in room', []);
    }

    socket.to(room).emit('client connected', socket.id);

    socket.on('chat message', (msg, room) => {
        console.log('chat message: ' + msg + ' to room: ' + room);
        //io.emit('chat message', msg);
        //socket.broadcast.emit('chat message', msg);
        socket.to(room).emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected with id: ' + socket.id);
      //socket.to(room).emit('chat message', 'Client with left with ID: ' + socket.id);
      socket.to(room).emit('client disconnected', socket.id);
    });

    socket.on('sendData', (data) => {
      socket.to(room).emit('sendData', data);
    });

  });

  io._nsps.forEach((value, key) => {
    console.log(`Namespace available: ${key}`);
  });

  instrument(io, {
    auth: {
      type: "basic",
      username: "admin",
      password: "$2a$10$b2YGU2pgQI.V8qhEMJp5/.fyqL76pnG7q7PswOVULnJhUDX3EVyNu", // Hashed password (bcrypt) -> See Bitwarden
    },
    mode: "development",
    allowRequest: (req, callback) => {
      const origin = req.headers.origin;
      if (
        origin === "http://localhost:3000" ||
        origin === "https://admin.socket.io"
      ) {
        return callback(null, true);
      }
      return callback("Origin not allowed", false);
    },
  });

  return io;
};