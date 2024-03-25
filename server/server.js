const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const { createServer } = require("http");
const server = createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		credentials: true,
	},
});
app.use(cors());
io.on("connection", (socket) => {
	console.log(`User connected: ${socket.id}`);
	socket.broadcast.emit("welcome", `Welcome to the chat ${socket.id}!`);

	socket.on("message", (msg) => {
		console.log(`Message: ${msg}`);
		socket.to(msg.room).emit(`chat here`, `chat message from ${socket.id} = ${msg.message}`);
	});

    socket.on("join room", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    }
    );

	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.id}`);
		socket.broadcast.emit("disconnected user", socket.id);
	});
});

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
