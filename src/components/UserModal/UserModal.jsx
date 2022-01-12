import { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import AvatarContainer from '../AvatarContainer/AvatarContainer';
import Modal from '../Modal/Modal';
import UserAvatar from '../UserAvatar/UserAvatar';
import ChooseAvatar from '../ChooseAvatar/ChooseAvatar';
import './UserModal.css';

const UserModal = ({ setModal }) => {
    const { authService } = useContext(UserContext);
    const history = useHistory();
    const initialState = {
        name: authService.name,
        email: authService.email,
        avatarName: authService.avatarName,
        avatarColor: authService.avatarColor
    };
    const [inputsFields, setInputFields] = useState(initialState);
    const [editDetails, setEditDetails] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const updateFields = ({target: { name, value } }) => {
        setInputFields({ ...inputsFields, [name]: value });
    }

    const chooseAvatar = avatar => {
        setInputFields({ ...inputsFields, avatarName: avatar });
        setShowAvatarModal(false);
    }

    const generateBgColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        setInputFields({ ...inputsFields, avatarColor: `#${randomColor}` });
    }

    const editProfile = e => {
        e.preventDefault();
        setEditDetails(true);
    }

    const cancelEdit = e => {
        e.preventDefault();
        setInputFields(initialState);
        setEditDetails(false);
    }

    const clickDelete = e => {
        e.preventDefault();
        setShowDeleteModal(true);
    }

    const saveUserDetails = e => {
        authService.updateUser(
            inputsFields.name,
            inputsFields.email,
            inputsFields.avatarName,
            inputsFields.avatarColor
        );
        setEditDetails(false);
    }

    const deleteUser = e => {
        e.preventDefault();
        authService.deleteUser();
        history.push('/login');
    }

    const logoutUser = () => {
        authService.logoutUser();
        setModal(false);
        history.push('/login');
    }

    return (
        <>
        { !editDetails ? <a href='/' className='edit-link' onClick={editProfile}>Edit Profile</a> : null }
        <div className='profile'>
            {
                !editDetails ? (
                    <UserAvatar avatar={{
                        avatarName: inputsFields.avatarName,
                        avatarColor: inputsFields.avatarColor
                    }} /> ) : (
                    <AvatarContainer
                        avatarName={inputsFields.avatarName}
                        avatarColor={inputsFields.avatarColor}
                        generateBgColor={generateBgColor}
                        setModal={setShowAvatarModal}
                    />
                )
            }
            <h4>Username: {' '}
                { editDetails ? (
                    <input type='text' name='name' value={inputsFields.name} onChange={updateFields} />
                ) : inputsFields.name }
            </h4>
            <h4>Email: {' '}
                { editDetails ? (
                    <input type='email' name='email' value={inputsFields.email} onChange={updateFields} />
                ) : inputsFields.email }
            </h4>
        </div>
        {
            editDetails
            ? (
                <>
                <a href='/' className='cancel-link' onClick={cancelEdit}>Cancel</a>
                <button className='submit-btn' onClick={saveUserDetails}>Save</button>
                <a className='delete-account-link' href='/' onClick={clickDelete}>&times; Delete My Account</a>
                </>
            )
            : <button className='submit-btn logout-btn' onClick={logoutUser}>Logout</button>
        }

        <Modal title='Are You Sure?' isOpen={showDeleteModal} close={() => setShowDeleteModal(false)}>
            <p>Are you sure you want to delete your account? This action CANNOT be undone, and you will need to sign up again if you change your mind later.</p>
            <button className='submit-btn' onClick={() => setShowDeleteModal(false)}>Nevermind, DO NOT Delete my account</button>
            <br />
            <button className='submit-btn logout-btn' onClick={deleteUser}>I'm Sure, Delete my account</button>
        </Modal>
        <Modal title='Choose Avatar' isOpen={showAvatarModal} close={() => setShowAvatarModal(false)}>
            <ChooseAvatar chooseAvatar={chooseAvatar} />
        </Modal>
        </>
    )
}

export default UserModal;
