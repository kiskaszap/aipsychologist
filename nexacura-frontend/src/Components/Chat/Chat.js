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
  const [messages, setMessages] = useState([]); // Store chat messages
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const endofPageRef = useRef(null);
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

  // Fetch previous messages from `/pastConversation` on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get("http://localhost:4000/pastConversation", {
          withCredentials: true,
        });
        if (res.data && res.data.conversation) {
          console.log("✅ Chat history retrieved:", res.data.conversation);
          const loadedMessages = res.data.conversation.map((msg) => ({
            message: msg.content,
            sentTime: msg.timestamp || "Earlier",
            sender: msg.sender === "user" ? "user" : "agent",
            direction: msg.sender === "user" ? "outgoing" : "incoming",
          }));
          setMessages(loadedMessages);
        } else {
          console.log("⚠️ No previous conversation found.");
        }
      } catch (error) {
        console.error("❌ Failed to load chat history:", error);
      }
    };

    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    endofPageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isSpeaking, isUserSpeaking, isRecording, activeTab]);

  useEffect(() => {
    socket.on("tts-audio", (audioData) => {
      console.log("Received AI-generated audio data.");
      try {
        const blob = new Blob([audioData], { type: "audio/mpeg" });
        setTimeout(() => {
          setIsSpeaking(true);
        }, 200);
        const audioURL = URL.createObjectURL(blob);
        const audio = new Audio(audioURL);
        audio.play();
        audio.onended = () => setIsSpeaking(false);
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
    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);
    try {
      // Limit conversation to the last 10 messages
      const trimmedMessages = [...messages, userMessage].slice(-10);
      const response = await axios.post(
        "http://localhost:4000/chatbot",
        {
          chatMessages: trimmedMessages.map((msg) => ({
            sender: msg.sender === "user" ? "user" : "assistant",
            content: msg.message,
          })),
        },
        { withCredentials: true }
      );
      let chatGPTMessage = {};
      if (response.data && response.data.choices) {
        chatGPTMessage = {
          message: response.data.choices[0].message.content,
          sentTime: "Just now",
          sender: "agent",
          direction: "incoming",
        };
        setMessages((prev) => [...prev, chatGPTMessage]);
        // Save conversation to backend
        await axios.post(
          "http://localhost:4000/chat",
          {
            conversation: [...trimmedMessages, chatGPTMessage].map((msg) => ({
              sender: msg.sender === "user" ? "user" : "assistant",
              content: msg.message,
            })),
          },
          { withCredentials: true }
        );
        if (activeTab === "voice") {
          speakText(chatGPTMessage.message);
        }
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
    } finally {
      setTyping(false);
    }
  };

  // Define speakText function
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
    // <div className="flex flex-col h-screen">
    //   {hasSubscription ? (
    //     <div className="flex flex-col flex-grow">
    //       <MainContainer className="flex flex-col flex-grow">
    //         <ChatContainer className="flex flex-col flex-grow">
    //           <MessageList className="flex-grow overflow-auto">
    //             {messages.map((message, index) => (
    //               <div
    //                 key={index}
    //                 className={`mb-8 w-3/4 ${message.sender === "user" ? "ml-auto" : ""}`}
    //               >
    //                 <Message model={message} />
    //               </div>
    //             ))}
    //             <div ref={messagesEndRef} />
    //           </MessageList>
    //         </ChatContainer>
    //       </MainContainer>

    //       {/* Redesigned Input / Mic Section */}
    //       <div className="flex justify-center items-center px-4 py-3 bg-gray-100">
    //         <div className="relative flex items-center w-full max-w-3xl">
    //           {activeTab === "chat" && (
    //             <MessageInput
    //               className="w-full"
    //               placeholder="Type message here..."
    //               onSend={handleSend}
    //               attachButton={false}
    //             />
    //           )}

    //           {/* Toggle Buttons */}
    //           <div className="absolute right-3 flex items-center space-x-2">
    //             <button
    //               onClick={() => setActiveTab("chat")}
    //               className={`p-2 rounded-full ${
    //                 activeTab === "chat" ? "bg-gray-300" : "bg-gray-200"
    //               } transition-all`}
    //             >
    //               <FaCommentAlt className="text-black text-lg" />
    //             </button>
    //             <button
    //               onClick={() => setActiveTab("voice")}
    //               className={`p-2 rounded-full ${
    //                 activeTab === "voice" ? "bg-green-500 text-white" : "bg-gray-200"
    //               } transition-all`}
    //             >
    //               <FaMicrophone className="text-lg" />
    //             </button>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Voice Mode: Show Mic Button / Wave Animation */}
    //       {activeTab === "voice" && (
    //         <div ref={end} className="flex items-center justify-center flex-grow">
    //           <div className="relative">
    //             <button
    //               className="bg-blue-500 text-white p-5 rounded-full shadow-lg flex items-center justify-center"
    //               onClick={startRecording}
    //               disabled={isRecording}
    //               style={{ width: "50px", height: "50px" }}
    //             >
    //               {!isUserSpeaking && !isSpeaking ? (
    //                 <FaMicrophone className="text-3xl" />
    //               ) : (
    //                 <div className="absolute inset-0 flex items-center justify-center">
    //                   {/* Display wave animation via AITalkVisualizer */}
    //                   <AITalkVisualizer
    //                     isSpeaking={isSpeaking || isUserSpeaking}
    //                     // Pass a prop to distinguish user vs AI wave if needed
    //                     color={isUserSpeaking ? "blue" : "green"}
    //                     size={50}
    //                   />
    //                 </div>
    //               )}
    //             </button>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   ) : (
    //     <div className="h-full pt-9 pb-20">
    //       <Text className="text-2xl text-primary font-semibold">My Subscription</Text>
    //       <div className="grid xl:grid-cols-3 lg:grid-cols-2 gap-8 mt-6">
    //         {subscriptions.map((subscription) => (
    //           <SubscriptionCard key={subscription.id} {...subscription} />
    //         ))}
    //       </div>
    //     </div>
    //   )}
    // </div>
   
    <div className="flex flex-col h-screen">
    {hasSubscription ? (
      <div className="flex flex-col flex-grow">
        <MainContainer className="flex flex-col flex-grow">
          <ChatContainer className="flex flex-col flex-grow">
            <MessageList className="flex-grow overflow-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-8 w-3/4 ${message.sender === "user" ? "ml-auto" : ""}`}
                >
                  <Message model={message} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </MessageList>
          </ChatContainer>
        </MainContainer>
  
        {/* ✅ Chat Mode: Input Field with Mic Icon */}
        {activeTab === "chat" && (
          <div className="flex justify-center items-center px-4 py-3">
            <div
              ref={endofPageRef}
              className="relative flex items-center w-full max-w-3xl bg-white px-3 py-2 rounded-lg shadow-md gap-2 overflow-hidden"
            >
              {/* ✅ Responsive Chat Input */}
              <MessageInput
                className="w-auto flex-grow bg-white"
                placeholder="Type message here..."
                onSend={handleSend}
                attachButton={false}
                sendButton={false}
              />
  
              {/* ✅ Microphone Icon (Only in Chat Mode) */}
              <div className="h-14 flex items-center">
                {!isSpeaking && !isUserSpeaking && (
                  <button
                    onClick={() => setActiveTab("voice")}
                    className="p-2 rounded-full bg-primary flex-shrink-0 transition-all"
                  >
                    <FaMicrophone className="text-lg text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
  
        {/* ✅ Voice Mode: Large Mic Button with Chat Icon */}
        {activeTab === "voice" && (
          <div ref={endofPageRef} className="flex items-center justify-center flex-grow">
            <div className="relative h-14 flex items-center">
              {!isSpeaking && !isUserSpeaking ? (
                <button
                  className="bg-blue-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                  onClick={startRecording}
                  disabled={isRecording}
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaMicrophone className="text-xl" />
                </button>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <AITalkVisualizer
                    isSpeaking={isSpeaking || isUserSpeaking}
                    isUser={isUserSpeaking }
                    size={50}
                  />
                </div>
              )}
  
              {/* ✅ Chat Icon (Only in Voice Mode) */}
              {!isSpeaking && !isUserSpeaking && (
                <button
                  onClick={() => setActiveTab("chat")}
                  className="absolute -right-14 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-green-500 flex-shrink-0 transition-all"
                >
                  <FaCommentAlt className="text-sm text-white m-1" />
                </button>
              )}
            </div>
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
