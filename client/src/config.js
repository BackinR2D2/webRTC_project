import socketIOClient from "socket.io-client";
import url from './urls';
const socket = socketIOClient(url, {transports: ['websocket'], forceBase64: true});
export default socket;