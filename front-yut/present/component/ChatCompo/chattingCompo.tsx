import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { StompSubscription } from "react-stomp";

const Chat = () => {
  const [messages, setMessages] = useState<Array<any>>([]);
  const [inputText, setInputText] = useState<string>("");

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL; // 서버 URL

  const onMessageReceived = (message: any) => {
    const updatedMessages = [...messages, JSON.parse(message.body)];
    setMessages(updatedMessages);
  };

  const handleInputTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputText(event.target.value);
  };

  const handleSend = () => {
    const message = { text: inputText };
    sendMessage("/app/chat.send", message);
    setInputText("");
  };

  const sendMessage = (topic: string, content: any) => {
    stompClient?.send(topic, {}, JSON.stringify(content));
  };

  let stompClient: Stomp.Client | undefined;

  useEffect(() => {
    const socket = new SockJS(`${serverUrl}/chat`);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient?.subscribe("/yut/chat", onMessageReceived);
    });
    return () => {
      stompClient?.disconnect(() => {});
    };
  }, []);

  return (
    <div>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message.text}</li>
        ))}
      </ul>
      <input type="text" value={inputText} onChange={handleInputTextChange} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
