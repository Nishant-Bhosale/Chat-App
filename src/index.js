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

let count = 0;

io.on("connection", (socket) => {
	socket.emit("updatedCount", count);
	socket.on("increment", () => {
		count++;
		io.emit("updatedCount", count);
	});
});

server.listen(port, () => {
	console.log(`port is running on ${port}`);
});
