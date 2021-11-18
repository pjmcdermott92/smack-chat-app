import React, { useState, createContext, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import './App.css';
import ChatApp from './components/ChatApp/ChatApp';
import UserCreate from './components/UserCreate/UserCreate';
import UserLogin from './components/UserLogin/UserLogin';

export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const context = {
    //authService
    //messageService
    appSelectedChannel: {},
    appSetChannel: (chnl) => {
      setAuthContext({ ...authContext, appSelectedChannel: chnl });
      // update messageService selected channel
    }
  }

  const [authContext, setAuthContext] = useState(context);

  return (
    <UserContext.Provider value={authContext}>
      {children}
    </UserContext.Provider>
  )
}

const PrivateRoute = ({ children }) => {
  const isLoggedIn = true;
  return isLoggedIn ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserCreate />} />
            <Route path="/" element={
              <PrivateRoute>
                <ChatApp />
              </PrivateRoute>
            } />
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
