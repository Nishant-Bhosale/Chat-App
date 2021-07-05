const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const socketio = require("socket.io");
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	// socket.emit("updatedCount", count);
	// socket.on("increment", () => {
	// 	count++;
	// 	io.emit("updatedCount", count);
	// });

	socket.emit("message", "Hey new User");

	socket.broadcast.emit("message", "A new user has joined");

	socket.on("sendMessage", (message) => {
		io.emit("message", message);
	});

	socket.on("sendLocation", (location) => {
		io.emit(
			"message",
			`https://google.com/maps?q=${location.latitude},${location.longitude}`,
		);
	});

	socket.on("disconnect", () => {
		io.emit("message", "A user has left");
	});
});

server.listen(port, () => {
	console.log(`port is running on ${port}`);
});
