import React, {useState, useEffect} from 'react'
import socket from '../config';
import Video from './Video';
import { Button } from '@chakra-ui/react';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input,
    SimpleGrid,
    Box
} from "@chakra-ui/react";
import { CheckCircleIcon } from '@chakra-ui/icons'

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
        socket.emit("sendMessage", {msg, room, name});
    }

    return (
        <>
            {
                nameGenerated ?
                <>
                    <h3>
                        Room {room}
                    </h3>   
                    <SimpleGrid style={{height: `${97.5}vh`, gridTemplateColumns: `auto ${24}vw`}} columns={2} spacingX="40px" spacingY="20px">
                        <Box className="video">
                            <Video users={users} room={room} />
                        </Box>
                        <Box className="chat">
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
                            <form onSubmit={handleMessage} style={{position: 'fixed', bottom: 0, width: `${100}%`}}>
                                <FormControl>
                                    <Input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} required />
                                    <Button colorScheme="teal" variant="outline" type="submit">
                                        <CheckCircleIcon w={6} h={6} />
                                    </Button>
                                </FormControl>
                            </form>
                        </Box>
                    </SimpleGrid>
                </>
                :
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const opts = {
                        name, room
                    };
                    socket.emit("join-room", opts);
                    setNameGenerated(true);
                }} id="name" className="nameInp">
                    <FormControl>
                        <Input style={{maxWidth: `${520}px`}} required autoFocus placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
                        <Button type="submit" colorScheme="blue" className="nameBtn">Confirm</Button>      
                    </FormControl>
                </form>
            }
        </>
    )
}

export default Room
