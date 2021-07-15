import socketIOClient from "socket.io-client";
import url from './urls';
const socket = socketIOClient(url, { rememberTransport: false, transports: ['websocket', 'polling'], upgrade: false});
export default socket;