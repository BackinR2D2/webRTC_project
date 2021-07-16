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
    Box,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    List,
    ListItem,
    ListIcon, 
    Grid,
    GridItem,
} from "@chakra-ui/react";
import { CheckCircleIcon } from '@chakra-ui/icons';
import {BsPersonFill, BsBullseye} from 'react-icons/bs';

function Room() {
    const [users, setUsers] = useState([]);
    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const room = window.location.href.split('/')[4];
    const [name, setName] = useState("");
    const [nameGenerated, setNameGenerated] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    useEffect(() => {
        socket.on('users', data => {
            setUsers(data);
        })

        socket.on("message", (data) => {
            setMessages([...messages, data]);
        })
    })

    useEffect(() => {
        socket.on('notification', data => {
            // console.log(data);
            toast({
                title: `${data.title} - ${data.description}`,
                position: 'top-left',
                duration: 2000,
                isClosable: true,
            })
        })
    }, [toast])

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
                    <div className="roomId">
                        <h3>
                            Room <span className="id">{room}</span>
                        </h3>    
                    </div>
                    
                    <Grid
                        h="97.5vh"
                        templateRows="repeat(2, 1fr)"
                        templateColumns="repeat(3, 1fr)"
                        gap={4}
                        >
                            <GridItem colSpan={2} bg="papayawhip">
                                <Box className="video">
                                    <Video users={users} room={room} />
                                </Box>
                            </GridItem>
                            <GridItem colSpan={2} bg="papayawhip">
                                <Box style={{height: `${48}vh`, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <Button colorScheme="teal" variant="outline" onClick={onOpen}>
                                        < BsPersonFill /> <span style={{height: `${16}px`, marginBottom: `${5}px`, marginLeft: `${8}px`}}>{users.length}</span>
                                    </Button>
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent>
                                        <ModalHeader>Persons in the room</ModalHeader>
                                        <ModalCloseButton />
                                            <ModalBody>
                                                <List spacing={3}>
                                                    {/* <ListItem>
                                                        <ListIcon as={MdCheckCircle} color="green.500" />
                                                            Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
                                                    </ListItem> */}
                                                    {
                                                        users.map((user, i) => (
                                                            <ListItem key={i}>
                                                                <ListIcon as={BsBullseye} color="green.500" />
                                                                {user.name}
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            </ModalBody>

                                            <ModalFooter>
                                                <Button colorScheme="blue" mr={3} onClick={onClose}>
                                                Close
                                                </Button>
                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                </Box>
                            </GridItem>
                        <GridItem colSpan={4}>
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
                                <form onSubmit={handleMessage} style={{position: 'relative', bottom: 0, width: `${100}%`}}>
                                    <FormControl style={{display: 'flex'}}>
                                        <Input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} required />
                                        <Button colorScheme="teal" type="submit">
                                            <CheckCircleIcon w={6} h={6} />
                                        </Button>
                                    </FormControl>
                                </form>
                            </Box>
                        </GridItem>
                    </Grid>
                </>
                :
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const opts = {
                        name, room
                    };
                    socket.emit("join-room", opts);
                    localStorage.setItem("name", name);
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
