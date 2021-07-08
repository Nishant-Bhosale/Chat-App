const generateMessages = (text) => {
	return {
		text: text,
		createdAt: new Date().getTime(),
	};
};

const generateLocationMessage = (url) => {
	return {
		url,
		createdAt: new Date().getTime(),
	};
};

module.exports = {
	generateMessages,
	generateLocationMessage,
};
