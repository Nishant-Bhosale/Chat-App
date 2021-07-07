const generateMessages = (text) => {
	return {
		text: text,
		createdAt: new Date().getTime(),
	};
};

module.exports = {
	generateMessages,
};
