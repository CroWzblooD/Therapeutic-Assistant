import './UserChatBubble.scss';

function UserChatBubble({ message }) {
    return (
        <div className="user-chat-bubble">
            <h4 className="user-chat-bubble__name">You</h4>
            <p className="user-chat-bubble__message">{message}</p>
        </div>
    )


}

export default UserChatBubble;