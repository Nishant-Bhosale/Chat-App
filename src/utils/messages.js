const generateMessages = (username, text) => {
	return {
		username,
		text,
		createdAt: new Date().getTime(),
	};
};

const generateLocationMessage = (username, url) => {
	return {
		username,
		url,
		createdAt: new Date().getTime(),
	};
};

module.exports = {
	generateMessages,
	generateLocationMessage,
};
