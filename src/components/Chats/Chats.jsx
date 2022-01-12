import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import UserAvatar from '../UserAvatar/UserAvatar';
import EditChat from './EditChat';
import { formatDate } from '../../helpers/dateFormat';
import './Chats.css';
import Modal from '../Modal/Modal';

const Chats = ({ chats }) => {
    const { authService, chatService, appSelectedChannel, socketService } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState('');
    const [typingMessage, setTypingMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        setMessages(chats);
    }, [chats]);

    useEffect(() => {
        if (appSelectedChannel.id) {
            chatService.findAllMessagesForChannel(appSelectedChannel.id)
                .then(res => setMessages(res));
        }
    }, [appSelectedChannel]);

    useEffect(() => {
        socketService.getUsersTyping(users => {
            let names = '';
            let usersTyping = 0;
            for (const [typingUser, chId] of Object.entries(users)) {
                if (typingUser !== authService.name && appSelectedChannel.id === chId) {
                    names = (names === '' ? typingUser : `${names}, ${typingUser}`);
                    usersTyping += 1;
                }
            }
            if (usersTyping > 0) {
                const verb = (usersTyping > 1) ? 'are' : 'is';
                setTypingMessage(`${names} ${verb} typing a message...`);
            } else {
                setTypingMessage('');
            }
        })
    }, [appSelectedChannel]);

    const onTyping = ({ target: { value } }) => {
        if (!value.length) {
            setIsTyping(false);
            socketService.stopTyping(authService.name);
        } else if (!isTyping) {
            socketService.startTyping(authService.name, appSelectedChannel.id);
        } else {
            setIsTyping(true);
        }
        setMessageBody(value);
    }

    const sendMessage = e => {
        e.preventDefault();
        const { name, id, avatarName, avatarColor } = authService;
        const user = {
            userName: name,
            userId: id,
            userAvatar: avatarName,
            userAvatarColor: avatarColor
        };
        socketService.addMessage(messageBody, appSelectedChannel.id, user);
        socketService.stopTyping(authService.name);
        setMessageBody('');
    }

    const clickDeleteMessage = msgId => {
        setSelectedMessage(msgId);
        setShowDeleteModal(!showDeleteModal);
    }

    const deleteMessage = () => {
        chatService.deleteMessage(selectedMessage);
        setMessages(messages.filter(message => message.id !== selectedMessage));
        setSelectedMessage('');
        setShowDeleteModal(false);
    }

    return(
        <>
        <div className="chat">
            <div className="chat-header">{console.log('STATE CHANGE')}
                <h3>#{appSelectedChannel.name} - </h3>
                <h4>{appSelectedChannel.description}</h4>
            </div>
            <div className="chat-list">
                {!!messages.length ? messages.map(msg => (
                    <div key={msg.id} className="chat-message">
                        <UserAvatar
                            avatar={{
                                avatarColor: msg.userAvatarColor,
                                avatarName: msg.userAvatar
                            }}
                            size="md"
                        />
                        <div className="chat-user">
                            <strong>{msg.userName}</strong>
                            <small>{formatDate(msg.timeStamp)}</small>
                            { msg.userId === authService.id && editMessage === '' && (
                                <>
                                <div className='message-actions'>
                                    <div onClick={() => setEditMessage(msg.id)}>Edit</div>
                                    <div onClick={() => clickDeleteMessage(msg.id)}>Delete</div>
                                </div>
                                </>
                            ) }
                            <div className="message-body">
                                {editMessage && authService.name === msg.userName && editMessage === msg.id.toString()
                                    ? <EditChat msg={msg} setEditMessage={setEditMessage} />
                                    : msg.messageBody
                                }
                            </div>
                        </div>
                    </div>
                )) : <div>No Messages</div> }
            </div>
            <form className="chat-bar" onSubmit={sendMessage}>
                <div className="typing">{typingMessage}</div>
                <div className="chat-wrapper">
                    <textarea
                        onChange={onTyping}
                        value={messageBody}
                        placeholder="type a message..."
                    />
                    <input type="submit" className="submit-btn" value="Send" />
                </div>
            </form>
        </div>

        <Modal title='Delete Message' isOpen={showDeleteModal} close={() => clickDeleteMessage('')}>
            <p>Are you sure you want to delete this message?</p>
            <button className='submit-btn' onClick={() => clickDeleteMessage('')}>No Don't Delete</button>
            <br />
            <button className='submit-btn logout-btn' onClick={deleteMessage}>I'm Sure, Delete Message</button>
        </Modal>
        </>
    )
}

export default Chats;
