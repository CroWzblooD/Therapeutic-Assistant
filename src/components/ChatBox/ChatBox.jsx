import { useState, useEffect, useRef } from "react";
import BotChatBubble from "../BotChatBubble/BotChatBubble";
import UserChatBubble from "../UserChatBubble/UserChatBubble";
import { 
    PaperPlaneTilt, 
    Brain, 
    Plus,
    Download
} from "@phosphor-icons/react";
import './ChatBox.scss';
import axios from "axios";
import loadingGif from '../../assets/messaging.gif';

function ChatBox({ isSideBarOpen, isTodaySelected, date }) {
    //TODO: improve the enter key functionality for better UI

    const [entryText, setEntryText] = useState("");
    const [messages, setMessages] = useState([]);
    const [messageLoading, setMessageLoading] = useState(false);
    const scrollRef = useRef(null);

    // Load messages from localStorage on component mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_messages_${date}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        } else {
            setMessages([{
                message: "Hello! I'm here to listen and help you process your thoughts and feelings. How are you doing today?",
                role: "CHATBOT",
            }]);
        }
    }, [date]);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`chat_messages_${date}`, JSON.stringify(messages));
        }
    }, [messages, date]);

    const handleNewChat = () => {
        if (window.confirm("Are you sure you want to start a new chat? This will clear the current conversation.")) {
            setMessages([{
                message: "Hello! I'm here to listen and help you process your thoughts and feelings. How are you doing today?",
                role: "CHATBOT",
            }]);
            setEntryText("");
        }
    };

    const handleDownloadChat = () => {
        const chatText = messages
            .map(msg => `${msg.role === 'CHATBOT' ? 'Therapeutic Assistant' : 'You'}: ${msg.message}`)
            .join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_${date}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleAddEntry = async (entryText) => {
        setMessages(prevMessages => [
            ...prevMessages,
            {
                message: entryText,
                role: "USER"
            }
        ]);

        setMessageLoading(true);
        setTimeout(() => {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);


        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
                user_message: entryText
            });

            setMessages(prevMessages => [
                ...prevMessages,
                {
                    message: response.data.chatbot_response,
                    role: "CHATBOT"
                }
            ]);

            if (response) {
                setMessageLoading(false);
                setTimeout(() => {
                    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            }
        } catch (error) {
            console.error("Error in getting chatbot response:", error);
        }
    };

    return (
        <div className={`chatbox ${isSideBarOpen ? 'chatbox--sidebar-open' : "chatbox--expanded"}`}>
            <div className="chatbox__header">
                <div className="chatbox__header-title">
                    <Brain weight="fill" />
                    <h2>Therapeutic Assistant</h2>
                </div>
                <div className="chatbox__header-actions">
                    <button 
                        className="chatbox__action-btn" 
                        onClick={handleNewChat}
                        title="Start New Chat"
                    >
                        <Plus weight="bold" />
                    </button>
                    <button 
                        className="chatbox__action-btn" 
                        onClick={handleDownloadChat}
                        title="Download Chat"
                    >
                        <Download weight="bold" />
                    </button>
                    <div className="chatbox__header-badge">
                        AI-Powered Emotional Support
                    </div>
                </div>
            </div>
            
            <div className="chatbox__conversation">
                {messages?.map((message, index) => (
                    message.role === "CHATBOT" 
                        ? <BotChatBubble key={index} message={message.message} />
                        : <UserChatBubble key={index} message={message.message} />
                ))}
                {messageLoading && (
                    <div className="chatbox__loading">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef}></div>
            </div>

            {isTodaySelected && (
                <div className="chatbox__input-area">
                    <div className="message-input">
                        <div className="message-input__field">
                            <textarea
                                placeholder="Share your thoughts..."
                                value={entryText}
                                onChange={(e) => setEntryText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (entryText.trim()) {
                                            handleAddEntry(entryText);
                                            setEntryText("");
                                        }
                                    }
                                }}
                                rows={1}
                            />
                        </div>
                        <button 
                            className="message-input__send"
                            onClick={() => {
                                if (entryText.trim()) {
                                    handleAddEntry(entryText);
                                    setEntryText("");
                                }
                            }}
                        >
                            <PaperPlaneTilt weight="fill" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBox;