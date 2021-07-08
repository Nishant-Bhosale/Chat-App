const express = require("express");
const path = require("path");
const http = require("http");
const Filter = require("bad-words");
const app = express();
const socketio = require("socket.io");
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const server = http.createServer(app);
const io = socketio(server);
const {
	generateMessages,
	generateLocationMessage,
} = require("./utils/messages");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
	// socket.emit("updatedCount", count);
	// socket.on("increment", () => {
	// 	count++;
	// 	io.emit("updatedCount", count);
	// });

	socket.on("join", ({ username, room }) => {
		socket.join(room);
		socket.emit("message", generateMessages("Hey New User!"));
		socket.broadcast
			.to(room)
			.emit("message", generateMessages(`${username} has joined`));
	});

	socket.on("sendMessage", (message, callback) => {
		const filter = new Filter();
		if (filter.isProfane(message)) {
			return callback("Please use good words");
		}
		console.log(message);
		console.log(generateMessages(message));
		io.emit("message", generateMessages(message));
		callback();
	});

	socket.on("sendLocation", (location, callback) => {
		io.emit(
			"locationMessage",
			generateLocationMessage(
				`https://google.com/maps?q=${location.latitude},${location.longitude}`,
			),
		);
		callback("Location Shared!");
	});

	socket.on("disconnect", () => {
		io.emit("message", generateMessages("A user has left"));
	});
});

server.listen(port, () => {
	console.log(`port is running on ${port}`);
});
