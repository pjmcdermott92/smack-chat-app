import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import Modal from '../Modal/Modal';
import { toCammelCase } from '../../helpers/cammelCase';
import './Channels.css';

const Channels = ({ unread, channels, setChannels }) => {

    const INIT = { name: '', description: '' };

    // const [channels, setChannels] = useState('');
    const [unreadChannels, setUnreadChannels] = useState([]);
    const [modal, setModal] = useState(false);
    const [newChannel, setNewChannel] = useState(INIT);
    const { authService, chatService, appSetChannel, socketService, appSelectedChannel } = useContext(UserContext);

    useEffect(() => {
        setUnreadChannels(unread);
    }, [unread]);

    useEffect(() => {
        chatService.findAllChannels().then(res => {
            setChannels(res);
            appSetChannel(res[0]);
        });
    },[]);

    useEffect(() => {
        socketService.getChannel(channelList => {
            setChannels(channelList);
        });
    }, []);

    const selectChannel = (channel) => () => {
        appSetChannel(channel);
        const unread = chatService.setUnreadChannels(channel);
        setUnreadChannels(unread);
    }

    const onChange = ({ target: { name, value }}) => {
        setNewChannel({ ...newChannel, [name]: value });
    }

    const createChannel = e => {
        e.preventDefault();
        const camelChannel = toCammelCase(newChannel.name);
        socketService.addChannel(camelChannel, newChannel.description);
        appSetChannel(chatService.channels[0]);
        setNewChannel(INIT);
        setModal();
    }

    return (
        <>
        <div className="channel">
            <div className="channel-header">
                <h3 className="channel-label">{authService.name}</h3>
            </div>
            <h3 className="channel-label">Channels <span onClick={() => setModal(true)}>Add +</span></h3>
            <div className="channel-list">
                {!!channels.length ? channels.map(channel => (
                    <div
                        key={channel.id}
                        className={`channel-label ${unreadChannels.includes(channel.id) ? 'unread' : ''}`}
                        onClick={selectChannel(channel)}
                    >
                        <div
                            className={`inner ${(appSelectedChannel && appSelectedChannel.id === channel.id) ? 'selected' : ''}`}
                        >
                            #{channel.name}
                        </div>
                    </div>
                )) : <div>No Channels. Please add a channel.</div>}
            </div>
        </div>
        <Modal title="Create Channel" isOpen={modal} close={setModal}>
            <form className="form channel-form" onSubmit={createChannel}>
                <input type="text" className="form-control" name="name" placeholder="enter channel name" onChange={onChange} />
                <input type="text" className="form-control" name="description" placeholder="enter channel description" onChange={onChange} />
                <input type="submit" className="submit-btn" value="Create Channel" />
            </form>
        </Modal>
        </>
    )
}

export default Channels;
