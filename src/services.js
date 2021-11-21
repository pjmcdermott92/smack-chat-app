import axios from "axios";
import io from 'socket.io-client';

const BASE_URL = 'http://localhost:3005/v1';
const URL_ACCOUNT = `${BASE_URL}/account`;
const URL_LOGIN = `${URL_ACCOUNT}/login`;
const URL_REGISTER = `${URL_ACCOUNT}/register`;

const URL_USER = `${BASE_URL}/user`;
const URL_USER_ADD = `${URL_USER}/add`;
const URL_USER_BY_EMAIL = `${URL_USER}/byEmail/`;

const URL_GET_CHANNELS = `${BASE_URL}/channel`;

const URL_GET_MESSAGES = `${BASE_URL}/message/byChannel/`;

const headers = { 'Content-Type': 'application/json' };

class User {
    constructor() {
        this.id = '';
        this.name = '';
        this.email = '';
        this.avatarName = 'avatarDefault.png';
        this.avatarColor = '';
        this.isLoggedIn = false;
    }

    setUserEmail(email) { this.email = email; }
    setIsLoggedIn(loggedIn) { this.isLoggedIn = loggedIn; }

    setUserData(userData) {
        const { _id, name, email, avatarName, avatarColor } = userData;
        this.id = _id;
        this.name = name;
        this.email = email;
        this.avatarName = avatarName;
        this.avatarColor = avatarColor;
    }
}

export class AuthService extends User {
    constructor() {
        super();
        this.authToken = '';
        this.bearerHeader = {};
    }

    setAuthToken(token) { this.authToken = token };
    setBearerHeader(token) {
        this.bearerHeader = {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        };
    }

    getBearerHeader = () => this.bearerHeader;

    logoutUser() {
        this.id = '';
        this.name = '';
        this.email = '';
        this.avatarName = '';
        this.avatarColor = '';
        this.isLoggedIn = false;
        this.authToken = '';
        this.bearerHeader = {};
    }

    async registerUser(email, password) {
        const body = { "email": email.toLowerCase(), "password": password };
        try {
            await axios.post(URL_REGISTER, body);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async createUser(name, email, avatarName, avatarColor) {
        const headers = this.getBearerHeader();
        const body = {
            "name": name,
            "email": email,
            "avatarName": avatarName,
            "avatarColor": avatarColor
        };
        try {
            const res = await axios.post(URL_USER_ADD, body, { headers });
            this.setUserData(res.data);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async loginUser(email, password) {
        const body = { "email": email.toLowerCase(), "password": password };
        try {
            const res = await axios.post(URL_LOGIN, body, { headers });
            this.setAuthToken(res.data.token);
            this.setBearerHeader(res.data.token);
            this.setUserEmail(res.data.user);
            this.setIsLoggedIn(true);
            await this.findUserByEmail();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async findUserByEmail() {
        const headers = this.getBearerHeader();
        try {
            const res = await axios.get(URL_USER_BY_EMAIL + this.email, { headers });
            this.setUserData(res.data);
        } catch (err) {
            console.error(err);
        }
    }
}

export class ChatService {
    constructor(authHeader) {
        this.getAuthHeader = authHeader;
        this.channels = [];
        this.unreadChannels = [];
        this.selectedChannel = {};
    }

    addChannel = channel => this.channels.push(channel);
    addMessage = chat => this.messages.push(chat);
    setSelectedChannel = channel => this.selectedChannel = channel;
    getSelectedChannel = () => this.selectedChannel;
    getAllChannels = () => this.channels;
    addToUnread = urc => this.unreadChannels.push(urc);

    setUnreadChannels = channel => {
        if (this.unreadChannels.includes(channel.id)) {
            this.unreadChanels = this.unreadChannels.filter(ch => ch !== channel.id);
        }
        return this.unreadChannels;
    }

    async findAllChannels() {
        const headers = this.getAuthHeader();
        try {
            let res = await axios.get(URL_GET_CHANNELS, { headers });
            res = res.data.map(channel => ({
                name: channel.name,
                description: channel.description,
                id: channel._id
            }));
            this.channels = [ ...res ];
            return res;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    async findAllMessagesForChannel(channelId) {
        const headers = this.getAuthHeader();
        try {
            let res = await axios.get(URL_GET_MESSAGES + channelId, { headers });
            res = res.data.map(msg => ({
                messageBody: msg.messageBody,
                channelId: msg.channelId,
                id: msg._id,
                userName: msg.userName,
                userAvatar: msg.userAvatar,
                userAvatarColor: msg.userAvatarColor,
                timeStamp: msg.timeStamp
            }));
            this.messages = res;
            return res;
        } catch (err) {
            console.error(err);
            this.messages = [];
            throw err;
        }
    }
}

export class SocketService {
    socket = io('http://localhost:3005/');
    constructor(chatService) {
        this.chatService = chatService;
    }

    establishConnection() {
        console.log('client connected');
        this.socket.connect();
    }

    closeConnection() {
        console.log('client disconnected');
        this.socket.disconnect();
    }

    addChannel(name, description) {
        this.socket.emit('newChannel', name, description);
    }

    getChannel(cb) {
        this.socket.on('channelCreated', (name, description, id) => {
            const channel = { name, description, id }
            this.chatService.addChannel(channel);
            const channelList = this.chatService.getAllChannels();
            cb(channelList);
        });
    }

    addMessage(messageBody, channelId, user) {
        const {userName, userId, userAvatar, userAvatarColor } = user;
        if (!!messageBody && !!channelId && !!user) {
            this.socket.emit('newMessage', messageBody, userId, channelId, userName, userAvatar, userAvatarColor);
        }
    }

    getChatMessage(cb) {
        this.socket.on('messageCreated', (messageBody, userId, channelId, userName, userAvatar, userAvatarColor, id, timeStamp) => {
            const channel = this.chatService.getSelectedChannel();
            const chat = { messageBody, userId, channelId, userName, userAvatar, userAvatarColor, id, timeStamp };
            if (channelId !== channel.id && !this.chatService.unreadChannels.includes(channelId)) {
                this.chatService.addToUnread(channelId);
            }
            this.chatService.messages = [...this.chatService.messages, chat];
            cb(chat, this.chatService.messages);
        });
    }

    startTyping(userName, channelId) {
        this.socket.emit('startType', userName, channelId);
    }

    stopTyping(userName) {
        this.socket.emit('startType', userName);
    }

    getUsersTyping(cb) {
        this.socket.on('userTypingUpdate', (typingUsers) => {
            cb(typingUsers);
        });
    }
}
