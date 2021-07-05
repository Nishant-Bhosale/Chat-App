const socket = io();

const submitButton = document.querySelector("#submit");
const inputText = document.querySelector("#client-message");
const sendLocationBtn = document.querySelector("#send-location");
// socket.on("updatedCount", (count) => {
// 	console.log("The count is ", count);
// });

submitButton.addEventListener("click", () => {
	// console.log("Clicked");

	socket.emit("sendMessage", inputText.value);
});

sendLocationBtn.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("Geolocation API is not supported.");
	}

	let locationObj = { latitude: null, longitude: null };
	navigator.geolocation.getCurrentPosition((location) => {
		locationObj.latitude = location.coords.latitude;
		locationObj.longitude = location.coords.longitude;
		socket.emit("sendLocation", locationObj);
	});
});

socket.on("welcomeMessage", (message) => {
	console.log(message);
});

socket.on("message", (message) => {
	console.log(message);
});
