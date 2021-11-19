import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { DARK_AVATARS, LIGHT_AVATARS } from '../../constants';
import Alert from '../Alert/Alert';
import Modal from '../Modal/Modal';
import './UserCreate.css';

const UserCreate = ({ history }) => {
    const { authService } = useContext(UserContext);
    const INIT_STATE = {
        userName: '',
        email: '',
        password: '',
        avatarName: 'avatarDefault.png',
        avatarColor: 'none'
    };
    const [userInfo, setUserInfo] = useState(INIT_STATE);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarTheme, setAvatarTheme] = useState('dark');

    const onChange = ({ target: { name, value } }) => {
        setUserInfo({ ...userInfo, [name]: value });
    }

    const chooseAvatar = avatar => {
        setUserInfo({ ...userInfo, avatarName: avatar });
        setModal(false);
    }

    const generateBgColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        setUserInfo({ ...userInfo, avatarColor: `#${randomColor}` });
    }

    const createUser = e => {
        e.preventDefault();
        const { userName, email, password, avatarName, avatarColor } = userInfo;
        if (!!userName && !!email && !!password) {
            setIsLoading(true);
            authService.registerUser(email, password).then(() => {
                authService.loginUser(email, password).then(() => {
                    authService.createUser(userName, email, avatarName, avatarColor).then(() => {
                        setUserInfo(INIT_STATE);
                        setAvatarTheme('dark');
                        history.push('/');
                    }).catch(err => {
                        console.error('creating user', err);
                        setError(true);
                    });
                }).catch(err => {
                    console.error('logging in user', err);
                    setError(true);
                });
            }).catch(err => {
                console.error('registering user', err);
                setError(true);
            });
            setIsLoading(false);
        };
    }

    const AVATARS = avatarTheme === 'light' ? LIGHT_AVATARS : DARK_AVATARS;
    const { userName, email, password, avatarName, avatarColor } = userInfo;
    const errorMessage = 'Error creating account. Please try again';

    return (
        <>
        <div className="center-display">
            { error ? <Alert message={errorMessage} type="alert-danger" /> : null }
            { isLoading ? <div>Loading...</div> : null }
            <h3 className="title">Create an account</h3>
            <form className="form" onSubmit={createUser}>
                <input
                    className="form-control"
                    type="text"
                    name="userName"
                    placeholder="enter user name"
                    onChange={onChange}
                    value={userName}
                />
                <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="enter email"
                    onChange={onChange}
                    value={email}
                />
                <input
                    className="form-control"
                    type="password"
                    name="password"
                    placeholder="enter password"
                    onChange={onChange}
                    value={password}
                />
                <div className="avatar-container">
                    <img className="avatar-icon avatar-border-radius" style={{ backgroundColor: avatarColor }} src={avatarName} alt="avatar" />
                    <div className="avatar-text" onClick={() => setModal(true)}>Choose Avatar</div>
                    <div className="avatar-text" onClick={generateBgColor}>Generate Background Color</div>
                </div>
                <input type="submit" className="submit-btn" value="Create Account" />
            </form>
            <div className="footer-text">Already have an account? Login <Link to="/login">HERE</Link></div>
        </div>
        <Modal title="Choose Avatar" isOpen={modal} close={() => setModal(false)}>
            <div className="avatar-theme-toggle">
                <input id="avatarDark" type="radio" name="avatarTheme" value="dark" defaultChecked={avatarTheme === 'dark'} onClick={() => setAvatarTheme('dark')} />
                <label htmlFor="avatarDark">Dark</label>
                <input id="avatarLight" type="radio" name="avatarTheme" value="light" defaultChecked={avatarTheme === 'light'} onClick={() => setAvatarTheme('light')} />
                <label htmlFor="avatarLight">Light</label>
            </div>
            <div className={`avatar-list ${avatarTheme === 'light' && 'light' }`}>
                {AVATARS.map(img => (
                    <div key={img} className="avatar-icon" onClick={() => chooseAvatar(img)} role="presentation">
                        <img src={img} alt="avatar" />
                    </div>
                ))}
            </div>
        </Modal>
        </>
    )
};

export default UserCreate;
