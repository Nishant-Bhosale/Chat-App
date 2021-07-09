const express = require("express");
const path = require("path");
const http = require("http");
const Filter = require("bad-words");
const app = express();
const socketio = require("socket.io");
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, "../public");
const {
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
} = require("./utils/users");
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

	socket.on("join", (options, callback) => {
		const { user, error } = addUser({ id: socket.id, ...options });

		if (error) {
			return callback(error);
		}

		socket.join(user.room);
		socket.emit("message", generateMessages("Admin", "Hey New User!"));
		socket.broadcast
			.to(user.room)
			.emit("message", generateMessages(`${user.username} has joined`));

		callback();
	});

	socket.on("sendMessage", (message, callback) => {
		const user = getUser(socket.id);

		const filter = new Filter();

		if (filter.isProfane(message)) {
			return callback("Please use good words");
		}

		io.to(user.room).emit("message", generateMessages(user.username, message));
		callback();
	});

	socket.on("sendLocation", (location, callback) => {
		const user = getUser(socket.id);

		io.to(user.room).emit(
			"locationMessage",
			generateLocationMessage(
				user.username,
				`https://google.com/maps?q=${location.latitude},${location.longitude}`,
			),
		);
		callback();
	});

	socket.on("disconnect", () => {
		const user = removeUser(socket.id);

		if (user) {
			io.emit("message", generateMessages("Admin", "A user has left"));
		}
	});
});

server.listen(port, () => {
	console.log(`port is running on ${port}`);
});
