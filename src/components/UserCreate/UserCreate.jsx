import React from 'react';
import { Link } from 'react-router-dom';
import { AVATARS } from '../../constants';
import Modal from '../Modal/Modal';
import './UserCreate.css';

const UserCreate = () => (
    <>
    <div className="center-display">
        <h3 className="title">Create an account</h3>
        <form className="form">
            <input type="text" className="form-control" name="userName" placeholder="enter user name" />
            <input type="email" className="form-control" name="userName" placeholder="enter email" />
            <input type="password" className="form-control" name="userName" placeholder="enter password" />
            <div className="avatar-container">
                <img className="avatar-icon avatar-border-radius" src="/avatarDefault.png" alt="avatar" />
                <div className="avatar-text">Choose Avatar</div>
                <div className="avatar-text">Generate Background Color</div>
            </div>
            <input type="submit" className="submit-btn" value="Create Account" />
        </form>
        <div className="footer-text">Already have an account? Login <Link to="/login">HERE</Link></div>
    </div>
    <Modal title="Choose Avatar" isOpen={true}>
        <div className="avatar-list">
            {AVATARS.map(img => (
                <div key={img} className="avatar-icon">
                    <img src={img} alt="avatar" />
                </div>
            ))}
        </div>
    </Modal>
    </>
);

export default UserCreate;
