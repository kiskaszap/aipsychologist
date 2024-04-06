import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

function Chat() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, how can I help you today?",
      sentTime: "Just now",
      sender: "agent",
    },
  ]);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sentTime: "Just now",
      sender: "user",
      direction: "outgoing",
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    // Now passing an array to processMessageToChatGPT
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return {
        role: role,
        content: messageObject.message,
      };
    });
    const systemMessage = {
      role: "system",
      content:
        "Explain all concept as you are a psychologist. Give short answers and always try to dig deeper into a problem. Try to be as compassionate as you can and always try to understand the user's problem. Always try to direct to the user to understand how to solve the problem by him/herself",
    };
    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data.choices[0].message.content);
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sentTime: "Just now",
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  return (
    <div className="flex flex-col h-full p-4">
      <MainContainer>
        <ChatContainer>
          <MessageList>
            {messages.map((message, index) => (
              // Wrapping each message in a flex container for alignment
              <div
                key={index}
                className={`flex w-full ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-1/2 p-2 rounded-lg ${
                    message.sender === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs text-right">{message.sentTime}</p>
                </div>
              </div>
            ))}
          </MessageList>
          <TypingIndicator
            content={typing ? "Psychologist is typing..." : null}
          />
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;
