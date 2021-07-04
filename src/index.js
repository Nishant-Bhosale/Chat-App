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

io.on("connection", () => {
	console.log("New webSocket Connection detected");
});

server.listen(port, () => {
	console.log(`port is running on ${port}`);
});
