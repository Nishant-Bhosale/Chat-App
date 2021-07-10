const socket = io();

const submitButton = document.querySelector("#submit");
const inputText = document.querySelector("#client-message");
const sendLocationBtn = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#message-form");
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const autoScroll = () => {
	const newMessage = messages.lastElementChild;

	const newMessageStyles = getComputedStyle(newMessage);
	const newMessageMargin = parseInt(newMessageStyles.marginBottom);

	const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

	const visibleHeight = messages.offsetHeight;

	const containerHeight = messages.scrollHeight;

	const scrollOffset = messages.scrollTop + visibleHeight;

	if (containerHeight - newMessageHeight <= scrollOffset) {
		messages.scrollTop = messages.scrollHeight;
	}
};

socket.on("roomData", ({ room, users }) => {
	console.log(room);
	console.log(users);
	const html = Mustache.render(sidebarTemplate, {
		room,
		users,
	});

	document.querySelector("#sidebar").innerHTML = html;
});

messageForm.addEventListener("submit", (e) => {
	e.preventDefault();

	submitButton.setAttribute("disabled", "disabled");

	const message = e.target.elements.message.value;

	socket.emit("sendMessage", message, (error) => {
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
	messages.insertAdjacentHTML("beforeend", html);
	autoScroll();
});

socket.on("locationMessage", (locationInfo) => {
	const html = Mustache.render(locationTemplate, {
		username: locationInfo.username,
		url: locationInfo.url,
		createdAt: moment(locationInfo.createdAt).format("h:mm a"),
	});
	messages.insertAdjacentHTML("beforeend", html);
	autoScroll();
});

socket.emit("join", { username, room }, (error) => {
	console.log(username);
	if (error) {
		alert(error);
		location.href = "/";
	}
});
