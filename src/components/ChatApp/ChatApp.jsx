import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import Modal from '../Modal/Modal';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css';
import Channels from '../Channels/Channels';
import Chats from '../Chats/Chats';

const ChatApp = () => {
    const { authService, socketService, chatService } = useContext(UserContext);
    const history = useHistory();
    const [modal, setModal] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [unreadChannels, setUnreadChannels] = useState([]);

    useEffect(() => {
        socketService.establishConnection();
        return () => socketService.closeConnection();
    }, []);

    useEffect(() => {
        socketService.getChatMessage((newMessage, messages) => {
            if (newMessage.channelId === chatService.selectedChannel.id) {
                setChatMessages(messages);
            }
            if (chatService.unreadChannels.length) {
                setUnreadChannels(chatService.unreadChannels);
            }
        });
    }, []);

    const logoutUser = () => {
        authService.logoutUser();
        setModal(false);
        history.push('/login');
    }

    return (
        <>
        <div className="chat-app">
            <nav>
                <h1>Smack Chat</h1>
                <div className="user-avatar" onClick={() => setModal(true)}>
                    <UserAvatar size="sm" className="nav-avatar" />
                    <div>{authService.name}</div>
                </div>
            </nav>
            <div className="smack-app">
                <Channels unread={unreadChannels} />
                <Chats chats={chatMessages} />
            </div>

            <Modal title="Profile" isOpen={modal} close={() => setModal(false)}>
                <div className="profile">
                    <UserAvatar />
                    <h4>Username: {authService.name}</h4>
                    <h4>Email: {authService.email}</h4>
                </div>
                <button className="submit-btn logout-btn" onClick={logoutUser}>Logout</button>
            </Modal>
        </div>
        </>
    );
}

export default ChatApp;
