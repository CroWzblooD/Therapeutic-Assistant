import { Brain } from "@phosphor-icons/react";
import './BotChatBubble.scss'


function BotChatBubble({ message }) {
    return (
        <div className="bot-chat-bubble">
            <div className="bot-chat-bubble__avatar">
                <Brain weight="fill" />
            </div>
            <div className="bot-chat-bubble__content">
                <div className="bot-chat-bubble__name">Therapeutic Assistant</div>
                <div className="bot-chat-bubble__message">{message}</div>
            </div>
        </div>
    )
}

export default BotChatBubble