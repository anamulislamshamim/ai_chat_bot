import React, { useState, useEffect, useRef } from "react";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    // const [username, setUsername] = useState('');

    const socket = useRef(null);

    useEffect(() => {
        // Initialize WebSocket only once
        socket.current = new WebSocket('ws://127.0.0.1:8000/ws/chat/');

        socket.current.onopen = () => {
            console.log('WebSocket connection established');
        };
        

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, `${data.prompt} : ${data.response}`]);
        };

        socket.current.onclose = (event) => {
            console.error('WebSocket closed: ', event.reason);
        };

        socket.current.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        return () => {
            // Cleanup WebSocket connection on component unmount
            socket.current.close();
        };
    }, []); // No dependencies, WebSocket is initialized once

    const sendMessage = () => {
        if (socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({ prompt: input }));
            setInput('');
        } else {
            console.error('WebSocket is not open');
        }
    };

    return (
        <div>
            {/* <input
                type="text"
                placeholder="Your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            /> */}
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;