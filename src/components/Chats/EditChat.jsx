import React, { useState } from 'react';

const EditChat = ({ msg, setEditMessage }) => {
    const { id, userName, channelId, userAvatar, userAvatarColor, messageBody } = msg;
    const [messageContent, setMessageContent] = useState(messageBody);

    const updateMessage = ({ target: { value } }) => setMessageContent(value);

    const onSubmit = e => {
        e.preventDefault();
        console.log(channelId);
    }

    const clickCancel = e => {
        e.preventDefault();
        setEditMessage('');
    }

    return (
        <form onSubmit={onSubmit}>
            <textarea
                className='edit-chat'
                value={messageContent}
                onChange={updateMessage}
            />
            <button className='submit-btn inline'>Save</button>
            <a href='/' className='cancel' onClick={clickCancel}>Cancel</a>
        </form>
    )
}

export default EditChat;
