const users = [];

const addUser = ({ id, username, room }) => {
	username = username.trim().toLowerCase();
	room = room.trim().toLowerCase();

	if (!username || !room) {
		return {
			error: "Username and room are required",
		};
	}

	const existingUser = users.find((user) => {
		return user.username === username && user.room === room;
	});

	if (existingUser) {
		return {
			error: "Username is already in use.",
		};
	}

	const user = { id, username, room };

	users.push(user);
	return { user };
};

const removeUser = (id) => {
	const index = users.findIndex((user) => {
		return user.id === id;
	});

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
};

// addUser({ id: 3, username: "Nishant", room: "roomname" });
// addUser();

// removeUser(3);
const res = addUser({ id: 5, username: "", room: "" });
console.log(users);
console.log(res);
