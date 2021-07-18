import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Container, Box, Button, Tooltip, useClipboard, useToast } from "@chakra-ui/react";
import url from '../urls';
import socket from "../config";

function Home() {
  const [id, setId] = useState("");
  const [generated, setGenerated] = useState(false);
  const [roomId, setRoomId] = useState("");
  const { hasCopied, onCopy } = useClipboard(id);
  const toast = useToast();
  const history = useHistory();

  const handleRoomGenerate = async () => {
    const {data: id} = await axios(`${url}/homepage`);
    const baseUrl = process.env.NODE_ENV === 'production' ? 'https://web-rtc-project-five.vercel.app' : 'http://localhost:3000';
    const link = `${baseUrl}/room/${id}`;
    setRoomId(id);
    setId(link);
    setGenerated(true);
  }

  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    if(hasCopied) {
      toast({
        title: "Successfully copied to the clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      })
    }
  })
  
  return (

      <Container className="hpSection" maxW="xl" bg="antiquewhite" centerContent>
        <div className="heading">
          <p>Generate a room and invite your friends</p>
        </div>
        <Box className="idSection" padding="4" maxW="3xl">
            {
              generated ? 
              <div>
                  <Button onClick={() => history.push(`/room/${roomId}`)} colorScheme="teal" variant="solid">
                    Join the room
                  </Button>
                  <Tooltip hasArrow label="Copy to clipboard" bg="red.600">
                    <p onClick={onCopy} className="generatedId">Room id: {roomId}</p>
                  </Tooltip>
              </div>
                :
              <Button colorScheme="blue" onClick={handleRoomGenerate}>Generate</Button>
            }
        </Box>
      </Container>
  );
}

export default Home
