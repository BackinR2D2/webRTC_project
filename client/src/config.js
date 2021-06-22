import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
const socket = socketIOClient(ENDPOINT, {transports: ['websocket'], forceBase64: true});
export default socket;