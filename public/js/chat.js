const socket = io();

const submitButton = document.querySelector("#submit");
const inputText = document.querySelector("#client-message");
const sendLocationBtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

submitButton.addEventListener("click", () => {
	submitButton.setAttribute("disabled", "disabled");

	socket.emit("sendMessage", inputText.value, (error) => {
		console.log(inputText.value);
		submitButton.removeAttribute("disabled");
		inputText.value = "";
		inputText.focus();
		if (error) {
			alert(error);
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

		socket.emit("sendLocation", locationObj, () => {
			sendLocationBtn.removeAttribute("disabled");
		});
	});
});

socket.on("message", (messageInfo) => {
	const html = Mustache.render(messageTemplate, {
		username: messageInfo.username,
		message: messageInfo.text,
		createdAt: moment(messageInfo.createdAt).format("h:mm a"),
	});
	console.log(username);
	messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (locationInfo) => {
	const html = Mustache.render(locationTemplate, {
		username: locationInfo.username,
		url: locationInfo.url,
		createdAt: moment(locationInfo.createdAt).format("h:mm a"),
	});
	messages.insertAdjacentHTML("beforeend", html);
});

socket.emit("join", { username, room }, (error) => {
	if (error) {
		alert(error);
		location.href = "/";
	}
});
