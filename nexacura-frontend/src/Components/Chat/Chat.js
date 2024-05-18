import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import subscriptions from "../../data/subscriptions";
import SubscriptionCard from "../../Components/Card/SubscriptionCard";
import Text from "../../Components/Text/Text";

const Chat = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get(
          "https://nexacura-f522fa3d182e.herokuapp.com/checkSubscription",
          {
            withCredentials: true,
          }
        );
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
          "https://nexacura-f522fa3d182e.herokuapp.com/pastConversation",
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

  // Function to handle sending messages
  // Function to handle sending messages
  const handleSend = async (messageText) => {
    const userMessage = {
      message: messageText,
      sentTime: "Just now",
      sender: "user",
      direction: "outgoing",
    };

    setTyping(true);

    try {
      // Process the message through your backend and get the response
      const response = await axios.post(
        "https://nexacura-f522fa3d182e.herokuapp.com/chatbot",
        {
          chatMessages: [...messages, userMessage].map((msg) => ({
            sender: msg.sender === "user" ? "user" : "assistant",
            content: msg.message,
          })),
        }
      );

      let chatGPTMessage = {};
      if (response.data && response.data.choices) {
        chatGPTMessage = {
          message: response.data.choices[0].message.content,
          sentTime: "Just now",
          sender: "agent",
          direction: "incoming",
        };
      }

      // Update local messages state with both user and ChatGPT messages
      setMessages((prevMessages) => [
        ...prevMessages,
        userMessage,
        chatGPTMessage,
      ]);

      // Optionally, send the updated conversation to the backend
      sendConversationToBackend([...messages, userMessage, chatGPTMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setTyping(false);
    }
  };

  // Scroll to the bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  async function sendConversationToBackend(conversation) {
    try {
      await axios.post(
        "https://nexacura-f522fa3d182e.herokuapp.com/chat",
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
};

export default Chat;
