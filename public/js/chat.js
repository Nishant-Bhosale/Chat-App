const socket = io();

const addButton = document.querySelector("#addBtn");

socket.on("updatedCount", (count) => {
	console.log("The count is ", count);
});

addButton.addEventListener("click", () => {
	console.log("Clicked");
	socket.emit("increment");
});
