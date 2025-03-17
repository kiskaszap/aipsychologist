import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { FaCommentAlt, FaMicrophone } from "react-icons/fa";
import subscriptions from "../../data/subscriptions";
import SubscriptionCard from "../../Components/Card/SubscriptionCard";
import Text from "../../Components/Text/Text";
import AITalkVisualizer from "../SpeachVisualiser/SpeachVisualiser";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const res = await axios.get("http://localhost:4000/checkSubscription", {
          withCredentials: true,
        });
        setHasSubscription(res.data.hasSubscription);
      } catch (error) {
        console.error("Failed to check subscription status:", error);
      }
    };
    checkSubscription();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("tts-audio", (audioData) => {
      console.log("Received AI-generated audio data.");

      try {
        const blob = new Blob([audioData], { type: "audio/mpeg" });

        setTimeout(() => {
          setIsSpeaking(true);
        }, 200); // ✅ Small delay for sync

        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);

        audio.play();
        audio.onended = () => {
          setIsSpeaking(false); // ✅ Stops exactly when AI finishes speaking
        };
      } catch (error) {
        console.error("Error playing AI audio:", error);
      }
    });

    return () => {
      socket.off("tts-audio");
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);
    setIsUserSpeaking(true);

    try {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        setIsUserSpeaking(false);
        handleSend(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setIsUserSpeaking(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
        setIsUserSpeaking(false);
      };
    } catch (error) {
      setIsRecording(false);
      console.error("Microphone access error:", error);
    }
  };

  const handleSend = async (messageText) => {
    const userMessage = {
      message: messageText,
      sentTime: "Just now",
      sender: "user",
      direction: "outgoing",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setTyping(true);

    try {
      const response = await axios.post("http://localhost:4000/chatbot", {
        chatMessages: [...messages, userMessage].map((msg) => ({
          sender: msg.sender === "user" ? "user" : "assistant",
          content: msg.message,
        })),
      });

      let chatGPTMessage = {};
      if (response.data && response.data.choices) {
        chatGPTMessage = {
          message: response.data.choices[0].message.content,
          sentTime: "Just now",
          sender: "agent",
          direction: "incoming",
        };

        setMessages((prevMessages) => [...prevMessages, chatGPTMessage]);

        if (activeTab === "voice") {
          speakText(chatGPTMessage.message);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setTyping(false);
    }
  };

  const speakText = async (text) => {
    setIsSpeaking(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/whisper-tts",
        { text, voice: "alloy" },
        { responseType: "blob" }
      );

      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error("Invalid response from server");
      }

      const audioURL = URL.createObjectURL(response.data);
      const audio = new Audio(audioURL);
      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error("Error generating speech:", error);
      setIsSpeaking(false);
    }
  };

  return (
    <div style={{ height: "calc(100vh - 3rem)" }} className="flex flex-col">
      {hasSubscription ? (
        <div className="flex flex-col flex-grow mr-16">
          <div className="fixed top-10 right-10 flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-lg">
            <button
              className={`p-3 rounded-full ${activeTab === "chat" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab("chat")}
            >
              <FaCommentAlt className="text-2xl" />
            </button>
            <button
              className={`p-3 rounded-full ${activeTab === "voice" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => setActiveTab("voice")}
            >
              <FaMicrophone className="text-2xl" />
            </button>
          </div>

          {activeTab === "chat" ? (
            <>
              <MainContainer className="flex flex-col flex-grow">
                <ChatContainer className="flex flex-col flex-grow">
                  <MessageList className="flex-grow overflow-auto">
                    {messages.map((message, index) => (
                      <div key={index} className={`mb-8 w-3/4 ${message.sender === "user" ? "ml-auto" : ""}`}>
                        <Message model={message} />
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </MessageList>
                </ChatContainer>
              </MainContainer>
              <MessageInput placeholder="Type message here" onSend={handleSend} />
            </>
          ) : (
            <div className="flex items-center justify-center flex-grow">
              {isSpeaking || isUserSpeaking ? (
                <AITalkVisualizer isSpeaking={isSpeaking || isUserSpeaking} isUser={isUserSpeaking} />
              ) : (
                <button
                  className="bg-blue-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                  onClick={startRecording}
                  disabled={isRecording}
                >
                  <FaMicrophone className="text-3xl" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="h-full pt-9 pb-20">
          <Text className="text-2xl text-primary font-semibold">My Subscription</Text>
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 mt-6">
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
