import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import Modal from '../Modal/Modal';
import UserModal from '../UserModal/UserModal';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css';
import Channels from '../Channels/Channels';
import Chats from '../Chats/Chats';

const ChatApp = () => {
    const { authService, socketService, chatService, appSetChannel, appSelectedChannel } = useContext(UserContext);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [unreadChannels, setUnreadChannels] = useState([]);
    const [channels, setChannels] = useState('');

    const deleteChannel = async () => {
        await chatService.deleteChannel(chatService.selectedChannel.id);
        setChannels(channels.filter(chnl => chnl.id !== chatService.selectedChannel.id));
        appSetChannel(chatService.channels[0]);
        setDeleteModal(false);
    }

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
                <Channels unread={unreadChannels} channels={channels} setChannels={setChannels} />
                {
                    chatService.channels.length && appSelectedChannel
                        ? <Chats chats={chatMessages} deleteChannel={() => setDeleteModal(true)} />
                        : <p>No channel selected.</p>
                }
            </div>

            <Modal title="Profile" isOpen={modal} close={() => setModal(false)}>
                <UserModal setModal={setModal} />
            </Modal>

            <Modal title='Delete Channel' isOpen={deleteModal} close={() => setDeleteModal(false)}>
                <p>Are you sure you want to delete this channel? This action CANNOT be undone, and other users will not be able to see this channel anymore.</p>
                <button className='submit-btn' onClick={() => setDeleteModal(false)}>No Don't Delete</button>
                <br />
                <button className='submit-btn logout-btn' onClick={deleteChannel}>I'm Sure, Delete Channel</button>
            </Modal>
        </div>
        </>
    );
}

export default ChatApp;
