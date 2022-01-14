import React, { useState } from 'react';

const EditChat = ({ msg, setEditMessage, updateMessage }) => {
    const { channelId, messageBody } = msg;
    const [messageContent, setMessageContent] = useState(messageBody);

    const onChange = ({ target: { value } }) => setMessageContent(value);

    // const onSubmit = e => {
    //     e.preventDefault();
    //     const body = {
    //         messageBody: messageContent,
    //         userId,
    //         channelId,
    //         userName,
    //         userAvatar,
    //         userAvatarColor
    //     };
    //     updateMessage(body);
    // }

    const onSubmit = e => {
        e.preventDefault();
        updateMessage({ messageContent, channelId });
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
                onChange={onChange}
            />
            <button className='submit-btn inline'>Save</button>
            <a href='/' className='cancel' onClick={clickCancel}>Cancel</a>
        </form>
    )
}

export default EditChat;
