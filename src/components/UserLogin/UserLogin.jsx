import React from 'react';
import { Link } from 'react-router-dom';

const UserLogin = () => (
    <div className="center-display">
        <form className="form">
            <label htmlFor="credentials">Enter your <strong>email address</strong> and <strong>password</strong>.</label>
            <input id="credentials" type="email" className="form-control" name="email" placeholder="elonmusk@tesla.com" />
            <input type="password" className="form-control" name="password" placeholder="password" />
            <input type="submit" className="submit-btn" value="Sign In" />
        </form>
        <div className="footer-text">No account? Create one <Link to="/register">HERE</Link></div>
    </div>
);

export default UserLogin;
