import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const sendIcon = (
	<svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path d='M19 10L1 1L5 10L1 19L19 10Z' stroke='black' strokeWidth='2' strokeLinejoin='round' />
	</svg>
);

export const ChatPage = () => {
	const navigate = useNavigate();
	const { name } = useParams();
	const ws = useRef();
	const [messages, setMessages] = useState([]);
	const [messageBody, setMessageBody] = useState("");

	useEffect(() => {
		ws.current = new WebSocket("ws://localhost:8081");

		// todo fix this
		ws.current.onmessage = (event) => {
			const message = JSON.parse(event.data);
			setMessages((prev) => [...prev, message]);
		};

		ws.current.onclose = (event) => {
			if (event.code === 4000) {
				navigate("/kicked", { state: { kickReason: event.reason } });
			}
		};

		return () => {
			ws.current.close();
		};
	}, []);

	const send = () => {
		if (messageBody === "") return;
		ws.current.send(JSON.stringify({ sender: name, body: messageBody }));
		setMessageBody("");
	};

	return (
		<main className='chat-wrapper'>
			<header className='chat-header'>
				<h1>WS channel</h1>
			</header>

			<div className='chat-view-container'>
				{messages.map((message) => (
					<article
						key={message.sentAt}
						className={"message-container" + (message.sender === name ? " own message" : "")}>
						<header className='message-header'>
							<h4 className='message-sender'>{message.sender === name ? "You" : message.sender}</h4>
							<span className='messag-time'>
								{new Date(message.sentAt).toLocaleTimeString(undefined, { timeStyle: "short" })}
							</span>
						</header>
						<p className='message-body'>{message.body}</p>
					</article>
				))}
			</div>

			<footer className='message-input-container'>
				<p className='chatting-as'>You're posting as "{name}".</p>

				<div className='message-input-container-inner'>
					<input
						autoFocus
						aria-label='Type a message'
						placeholder='Type a message'
						type='text'
						autoComplete='off'
						value={messageBody}
						onChange={(event) => setMessageBody(event.target.value)}
						onkeyPress={(event) => {
							if (event.key === "Enter") send();
						}}
					/>

					<button aria-label='Send' className='icon-button' onClick={send}>
						{sendIcon}
					</button>
				</div>
			</footer>
		</main>
	);
};

