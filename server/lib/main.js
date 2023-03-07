const WebSocket = require("ws");

const users = new Set();

const server = new WebSocket.Server({ port: 8081 }, () =>
	console.log("Server running on port 8081."),
);

const sendMessage = (message) => {
	for (const user of users) {
		user.socket.send(JSON.stringify(message));
	}
};

server.on("connection", (socket) => {
	const userRef = {
		socket: socket,
		lastActiveAt: Date.now(),
	};

	users.add(userRef);

	socket.on("message", (message) => {
		try {
			const parsedMessage = JSON.parse(message);
			if (typeof parsedMessage.sender !== "string" || typeof parsedMessage.body !== "string") {
				console.error("Invalid message format. Both sender and body must be strings.", message);
				return;
			}

			const verifiedMessage = {
				sender: parsedMessage.sender,
				body: parsedMessage.body,
				sentAt: Date.now(),
			};

			sendMessage(verifiedMessage);
			userRef.lastActiveAt = Date.now();
		} catch (error) {
			console.error("Error parsing message.", error);
		}
	});

	socket.on("close", (code, reason) => {
		console.log(`User disconnected. Code: ${code}, reason: ${reason}.`);
		users.delete(userRef);
	});

	setInterval(() => {
		const now = Date.now();

		for (const user in users) {
			if (now - user.lastActiveAt > 300000) {
				user.socket.close(4000, "inactivity");
			}
		}
	}, 10000);
});

