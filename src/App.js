import React, { useState, createContext, useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';
import ChatApp from './components/ChatApp/ChatApp';
import UserCreate from './components/UserCreate/UserCreate';
import UserLogin from './components/UserLogin/UserLogin';
import { AuthService, ChatService, SocketService } from './services';

const authService = new AuthService();
const chatService = new ChatService(authService.getBearerHeader);
const socketService = new SocketService(chatService.addChannel, chatService.getAllChannels);
export const UserContext = createContext();

const AuthProvider = ({ children }) => {
  const context = {
    authService,
    chatService,
    socketService,
    appSelectedChannel: {},
    appSetChannel: (chnl) => {
      setAuthContext({ ...authContext, appSelectedChannel: chnl });
      chatService.setSelectedChannel(chnl);
    }
  }

  const [authContext, setAuthContext] = useState(context);

  return (
    <UserContext.Provider value={authContext}>
      {children}
    </UserContext.Provider>
  )
}

const PrivateRoute = ({ children, ...props }) => {
  const context = useContext(UserContext);
  return <Route {...props} render={({ location }) => context.authService.isLoggedIn
    ? (children)
    : <Redirect to={{ pathname: '/login', state: { from: location }}} />}
  />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
            <Route exact path="/login" component={UserLogin} />
            <Route exact path="/register" component={UserCreate} />
            <PrivateRoute>
              <ChatApp />
            </PrivateRoute>
          </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
