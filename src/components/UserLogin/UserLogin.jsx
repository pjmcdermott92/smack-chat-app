import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import Alert from '../Alert/Alert';

const UserLogin = ({ location, history }) => {
    const { authService } = useContext(UserContext);
    const [userLogins, setUserLogins] = useState({ email: '', password: '' });
    const [error, setError] = useState(false);

    const onChange = ({ target: { name, value } }) => {
        setUserLogins({ ...userLogins, [name]: value });
    }

    const onLoginUser = e => {
        e.preventDefault();
        const { email, password } = userLogins;
        if (!!email && !!password) {
            const { from } = location.state || { from: { pathname: '/' }};
            authService.loginUser(email, password)
                .then(() => history.replace(from))
                .catch(() => {
                    setError(true);
                    setUserLogins({ email: '', password: '' });
                })
        }
    }

    const errorMessage = 'Sorry, you entered an incorrect email or password';
    return (
        <div className="center-display">
            { error ? <Alert message={errorMessage} type="alert-danger" /> : null }
            <form onSubmit={onLoginUser} className="form">
                <label htmlFor="credentials">Enter your <strong>email address</strong> and <strong>password</strong>.</label>
                <input
                    id="credentials"
                    className="form-control"
                    name="email"
                    value={userLogins.email}
                    type="email"
                    placeholder="elonmusk@tesla.com"
                    onChange={onChange}
                />
                <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={userLogins.password}
                    placeholder="password"
                    onChange={onChange}
                />
                <input type="submit" className="submit-btn" value="Sign In" />
            </form>
            <div className="footer-text">No account? Create one <Link to="/register">HERE</Link></div>
        </div>
    )
};

export default UserLogin;
