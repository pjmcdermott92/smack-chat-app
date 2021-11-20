import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import Modal from '../Modal/Modal';
import './Channels.css';

const Channels = () => {

    const INIT = { name: '', description: '' };

    const [channels, setChannels] = useState('');
    const [modal, setModal] = useState(false);
    const [newChannel, setNewChannel] = useState(INIT);
    const { authService, chatService, appSetChannel, socketService, appSelectedChannel } = useContext(UserContext);

    useEffect(() => {
        chatService.findAllChannels().then(res => {
            setChannels(res);
        });
    }, []);

    useEffect(() => {
        socketService.getChannel(channel => {
            setChannels([ ...channels, channel ]);
        })
    }, [channels]);

    const selectChannel = (channel) => () => {
        appSetChannel(channel);
    }

    const onChange = ({ target: { name, value }}) => {
        setNewChannel({ ...newChannel, [name]: value });
    }

    const createChannel = e => {
        e.preventDefault();
        socketService.addChannel(newChannel.name, newChannel.description);
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
                        className="channel-label"
                        onClick={selectChannel(channel)}
                    >
                        <div
                            className={`inner ${(appSelectedChannel.id === channel.id) ? 'selected' : ''}`}
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
