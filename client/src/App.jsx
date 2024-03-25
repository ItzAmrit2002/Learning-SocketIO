import { useEffect, useState, useRef, useMemo } from "react";
import { io } from "socket.io-client";
import "./App.css";

function App() {
	const socket = useMemo(() => io("http://localhost:3000"), []);

	const [message, setMessage] = useState("");
	const [room, setRoom] = useState("");
	const [socketId, setSocketId] = useState("");
	const [messages, setMessages] = useState([]);
	const [roomName, setRoomName] = useState("");

	const handleClick2 = (e) => {
		e.preventDefault();
		socket.emit("join room", roomName);
		setRoomName("");
	};

	const handleChange = (e) => {
		setMessage(e.target.value);
	};

	const handleClick = (e) => {
		e.preventDefault();
		socket.emit("message", { message, room });
		setMessage("");
	};

	useEffect(() => {
		socket.on("connect", () => {
			console.log(`Connected: ${socket.id}`);
			setSocketId(socket.id);
		});

		socket.on("disconnected user", (id) => {
			console.log(`User disconnected: ${id}`);
		});

		// socket.emit("message", message)
		socket.on("chat here", (msg) => {
			setMessages((messages) => [...messages, msg]);
			console.log(msg);
		});

		socket.on("welcome", (message) => {
			console.log(message);
		});

		return () => {
			socket.disconnect();
		};
	}, []); // Add an empty dependency array here

	return (
		<div className="container">
			<h3>Hello {socketId} </h3>
			<form>
				<input
					type="text"
					value={roomName}
					onChange={(e) => setRoomName(e.target.value)}
				/>
				<button onClick={handleClick2}>Join Room</button>
			</form>
			<form>
				<input
					value={message}
					onChange={handleChange}
					type="text"
					placeholder="message"
				/>
				<input
					value={room}
					onChange={(e) => setRoom(e.target.value)}
					type="text"
					placeholder="room id"
				/>
				<button onClick={handleClick}>Send</button>
			</form>

			<h3>Messages</h3>
			<br />

			{messages.map((msg, index) => (
				<div key={index}>{msg}</div>
			))}
		</div>
	);
}

export default App;
