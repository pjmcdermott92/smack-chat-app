import UserAvatar from '../UserAvatar/UserAvatar';
import './AvatarContainer.css';

const AvatarContainer = ({ avatarName, avatarColor, generateBgColor, setModal }) => (
    <div className="avatar-container">
        <UserAvatar avatar={{ avatarName, avatarColor }} className="create-avatar" />
        <div className="avatar-text" onClick={() => setModal(true)}>Choose Avatar</div>
        <div className="avatar-text" onClick={generateBgColor}>Generate Background Color</div>
    </div>
)

export default AvatarContainer;
