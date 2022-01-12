import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import Modal from '../Modal/Modal';
import UserModal from '../UserModal/UserModal';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css';
import Channels from '../Channels/Channels';
import Chats from '../Chats/Chats';

const ChatApp = () => {
    const { authService, socketService, chatService } = useContext(UserContext);
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
                <UserModal setModal={setModal} />
            </Modal>
        </div>
        </>
    );
}

export default ChatApp;
