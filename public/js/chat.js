const socket = io();

const submitButton = document.querySelector("#submit");
const inputText = document.querySelector("#client-message");
const sendLocationBtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

submitButton.addEventListener("click", () => {
	submitButton.setAttribute("disabled", "disabled");

	socket.emit("sendMessage", inputText.value, (error) => {
		submitButton.removeAttribute("disabled");
		inputText.value = "";
		inputText.focus();
		if (error) {
			return console.log(error);
		}
	});
});

sendLocationBtn.addEventListener("click", () => {
	if (!navigator.geolocation) {
		return alert("Geolocation API is not supported.");
	}

	sendLocationBtn.setAttribute("disabled", "disabled");

	let locationObj = { latitude: null, longitude: null };
	navigator.geolocation.getCurrentPosition((location) => {
		locationObj.latitude = location.coords.latitude;
		locationObj.longitude = location.coords.longitude;

		socket.emit("sendLocation", locationObj, (message) => {
			sendLocationBtn.removeAttribute("disabled");
			console.log(message);
		});
	});
});

socket.on("message", (message) => {
	const html = Mustache.render(messageTemplate, {
		message: message.text,
		createdAt: moment(message.createdAt).format("h:mm a"),
	});
	messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (url) => {
	const html = Mustache.render(locationTemplate, {
		url,
	});
	messages.insertAdjacentHTML("beforeend", html);
});
