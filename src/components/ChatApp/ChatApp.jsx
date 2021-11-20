import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';
import Modal from '../Modal/Modal';
import UserAvatar from '../UserAvatar/UserAvatar';
import './ChatApp.css';
import Channels from '../Channels/Channels';

const ChatApp = () => {
    const { authService, socketService } = useContext(UserContext);
    const history = useHistory();
    const [modal, setModal] = useState(false);

    useEffect(() => {
        socketService.establishConnection();
        return () => socketService.closeConnection();
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
                <Channels />
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
