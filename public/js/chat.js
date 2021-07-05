const socket = io();

const submitButton = document.querySelector("#submit");
const inputText = document.querySelector("#client-message");
const sendLocationBtn = document.querySelector("#send-location");
// socket.on("updatedCount", (count) => {
// 	console.log("The count is ", count);
// });

submitButton.addEventListener("click", () => {
	// console.log("Clicked");

	socket.emit("sendMessage", inputText.value, (error) => {
		if (error) {
			return console.log(error);
		}
		console.log("The message has been delivered.");
	});
});

sendLocationBtn.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("Geolocation API is not supported.");
	}

	let locationObj = { latitude: null, longitude: null };
	navigator.geolocation.getCurrentPosition((location) => {
		locationObj.latitude = location.coords.latitude;
		locationObj.longitude = location.coords.longitude;
		socket.emit("sendLocation", locationObj, (message) => {
			console.log("Your message has been delivered successfully");
			console.log(message);
		});
	});
});

socket.on("welcomeMessage", (message) => {
	console.log(message);
});

socket.on("message", (message) => {
	console.log(message);
});
