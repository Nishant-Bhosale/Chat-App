const socket = io();

const submitButton = document.querySelector("#submit");
const inputText = document.querySelector("#client-message");

// socket.on("updatedCount", (count) => {
// 	console.log("The count is ", count);
// });

submitButton.addEventListener("click", () => {
	// console.log("Clicked");

	socket.emit("sendMessage", inputText.value);
});

socket.on("welcomeMessage", (message) => {
	console.log(message);
});
