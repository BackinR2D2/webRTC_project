import React, {useState, useEffect} from 'react'
import socket from '../config';
import Video from './Video';
import { Button } from '@chakra-ui/react';
// import {
//     FormControl,
//     FormLabel,
//     FormErrorMessage,
//     FormHelperText,
//     Input
//   } from "@chakra-ui/react"

function Room() {
    const [users, setUsers] = useState(null);
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const room = window.location.href.split('/')[4];
    const [name, setName] = useState("");
    const [nameGenerated, setNameGenerated] = useState(false);

    useEffect(() => {
        socket.on('notification', data => {
            // console.log(data);
        })

        socket.on('users', data => {
            setUsers(data);
        })

        socket.on("message", (data) => {
            setMessages([...messages, data]);
        })
    })

    const handleMessage = (e) => {
        e.preventDefault();
        setMsg("");
        socket.emit("sendMessage", {msg, room});
    }

    return (
        <div>
            {
                nameGenerated ?
                    <div>
                        <h3>
                            Room {room}
                        </h3>
                        <div className="video">
                            <Video users={users} room={room} />
                        </div>
                        <div className="chat">
                            <form onSubmit={handleMessage}>
                                <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} required />
                                <Button colorScheme="teal" variant="outline" type="submit">Send message</Button>
                            </form>
                            {/* <FormControl onSubmit={handleMessage} id="sendMessage" isRequired>
                                <Input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message" />
                                <Button colorScheme="teal" variant="outline" type="submit">Send message</Button>
                            </FormControl> */}
                            <br />
                            <div className="messages">
                                {
                                    messages && messages.map((m,i) => (
                                        <div className="message" key={i}>
                                            <p>
                                                {m.text} sent by <span><b>{m.user}</b></span>
                                            </p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                :
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const opts = {
                        name,room
                    }
                    socket.emit("join-room", opts);
                    setNameGenerated(true);
                }}>
                    <input autoFocus type="text" required placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
                    <Button type="submit" colorScheme="blue">Save</Button>
                    {/* <button type="submit">Save</button> */}
                </form>
            }
        </div>
    )
}

export default Room
