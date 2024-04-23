import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Text from "../../Components/Text/Text";
import subscriptions from "../../data/subscriptions";
import SubscriptionCard from "../../Components/Card/SubscriptionCard";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const API_KEY = "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"; // Be cautious with exposing API keys

function Chat() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [hasSubscription, setHasSubscription] = useState(false); // State to track subscription status
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get("http://localhost:4000/checkSubscription", {
          withCredentials: true,
        });
        console.log(res.data);
        setHasSubscription(res.data.hasSubscription);
        console.log(res.data.hasSubscription);
      } catch (error) {
        console.error("Failed to check subscription status:", error);
      }
    };

    checkSubscription(); // Check subscription on component mount
  }, [typing]);

  useEffect(() => {
    const fetchPastConversations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/pastConversation",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Ensures cookies, such as session cookies, are sent with the request
          }
        );
        if (response.data && response.data.conversation) {
          console.log(response.data.conversation);
          setMessages(response.data.conversation);
        } else {
          // Set a default message if no past conversation data is found
          setMessages([
            {
              message:
                "Hi, it's Sophia your AI psychologist. How can I help you today?",
              sentTime: "Just now",
              sender: "agent",
            },
          ]);
        }
      } catch (error) {
        // console.error("Failed to fetch past conversations:", error);
        // Handle 404 and 500 status with a default message
        if (
          error.response &&
          (error.response.status === 404 || error.response.status === 500)
        ) {
          setMessages([
            {
              message:
                "Hi, this is Sophia your AI psychologist. How can I help you today?",
              sentTime: "Just now",
              sender: "agent",
            },
          ]);
        }
      }
    };

    fetchPastConversations();
  }, []);
  useEffect(() => {
    scrollToBottom(); // Scroll to bottom every time messages update
  }, [hasSubscription, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  const handleSend = async (messageText) => {
    const userMessage = {
      message: messageText,
      sentTime: "Just now",
      sender: "user",
      direction: "outgoing",
    };

    // Update messages state with user message
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setTyping(true);

    // Process the response from ChatGPT
    const chatGPTMessage = await processMessageToChatGPT([
      ...messages,
      userMessage,
    ]);
    if (chatGPTMessage) {
      setMessages((prevMessages) => [...prevMessages, chatGPTMessage]);
    }

    setTyping(false);

    // Send conversation to backend
    sendConversationToBackend([...messages, userMessage, chatGPTMessage]);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((msg) => ({
      role: msg.sender === "agent" ? "assistant" : "user",
      content: msg.message,
    }));

    const systemMessage = {
      role: "system",
      content:
        "Explain all concept as you are a psychologist. Give short answers and always try to dig deeper into a problem. Try to be as compassionate as you can and always try to understand the user's problem. Always try to direct to the user to understand how to solve the problem by him/herself, never give bulletpoints, instead try to make the user understand the problem and how to solve it by asking questions, always ask questions to understand the user's problem. Don`t tell them to seek professional help from psychologists that`s why they are using your service. At the beginning of the conversation ask user how old are they, are they girls boys or something else. Always ask about the user`s first name",
    };

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [systemMessage, ...apiMessages],
          }),
        }
      );

      const data = await response.json();
      return {
        message: data.choices[0].message.content,
        sentTime: "Just now",
        sender: "agent",
      };
    } catch (error) {
      console.error("Error processing message with ChatGPT:", error);
      return null;
    }
  }

  async function sendConversationToBackend(conversation) {
    try {
      await axios.post(
        "http://localhost:4000/chat",
        { conversation: conversation },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true, // This allows cookies to be sent along with the request
        }
      );
    } catch (error) {
      console.error("Error sending conversation to backend:", error);
    }
  }

  return (
    <div style={{ height: "calc(100vh - 3rem)" }} className="flex flex-col ">
      {" "}
      {/* h-screen to take full viewport height */}
      {hasSubscription ? (
        <div className="flex flex-col flex-grow">
          {" "}
          {/* flex-grow to fill the space */}
          <MainContainer className="flex flex-col flex-grow">
            {" "}
            {/* Ensure MainContainer is flex and takes available height */}
            <ChatContainer className="flex flex-col flex-grow">
              {" "}
              {/* Flex container for chat */}
              <MessageList
                className="flex-grow overflow-auto"
                typingIndicator={
                  typing ? (
                    <TypingIndicator content="Sophia is typing..." />
                  ) : null
                }
              >
                {messages.map((message, index) => {
                  // Check if message is null or message is not an object with a 'sender' property
                  if (
                    message == null ||
                    typeof message !== "object" ||
                    !message.hasOwnProperty("sender")
                  ) {
                    // Skip rendering this message
                    return null;
                  }
                  return (
                    <div
                      key={index}
                      className={`mb-8 w-3/4 ${
                        message.sender === "user" ? "ml-auto" : ""
                      }`}
                    >
                      <Message
                        model={{
                          message: message.message,
                          sentTime: message.sentTime,
                          sender: message.sender,
                          direction:
                            message.sender === "user" ? "outgoing" : "incoming",
                        }}
                      />
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </MessageList>
            </ChatContainer>
          </MainContainer>
          <MessageInput placeholder="Type message here" onSend={handleSend} />
        </div>
      ) : (
        <div className=" h-full  pt-9 pb-20">
          <Text className="text-2xl text-primary font-semibold">
            My Subscription
          </Text>
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 mt-6 ">
            {subscriptions.map((subscription) => (
              <SubscriptionCard key={subscription.id} {...subscription} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
