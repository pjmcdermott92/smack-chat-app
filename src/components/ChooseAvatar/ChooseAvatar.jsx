import { useState } from 'react';
import { DARK_AVATARS, LIGHT_AVATARS } from '../../constants';
import './ChooseAvatar.css';

const ChooseAvatar = ({ chooseAvatar }) => {
    const [avatarTheme, setAvatarTheme] = useState('dark');

    const AVATARS = avatarTheme === 'light' ? LIGHT_AVATARS : DARK_AVATARS;
    

    return (
        <>
        <div className="avatar-theme-toggle">
            <input id="avatarDark" type="radio" name="avatarTheme" value="dark" defaultChecked={avatarTheme === 'dark'} onClick={() => setAvatarTheme('dark')} />
            <label htmlFor="avatarDark">Dark</label>
            <input id="avatarLight" type="radio" name="avatarTheme" value="light" defaultChecked={avatarTheme === 'light'} onClick={() => setAvatarTheme('light')} />
            <label htmlFor="avatarLight">Light</label>
        </div>
        <div className={`avatar-list ${avatarTheme === 'light' && 'light' }`}>
            {AVATARS.map(img => (
                <div key={img} className="create-avatar" onClick={() => chooseAvatar(img)} role="presentation">
                    <img src={img} alt="avatar" />
                </div>
            ))}
        </div>
        </>
    )
}

export default ChooseAvatar;
