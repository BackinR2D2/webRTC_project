import React, {useRef, useCallback, useState, useEffect} from 'react'
import Webcam from "react-webcam";
import socket from '../config';
import Gallery from './Gallery';
import Peer from 'simple-peer';
import { SimpleGrid, Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react"


const mergeRefs = (...refs) => {
  const filteredRefs = refs.filter(Boolean);
  if (!filteredRefs.length) return null;
  if (filteredRefs.length === 0) return filteredRefs[0];
  return inst => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst);
      } else if (ref) {
        ref.current = inst;
      }
    }
  };
};

const webcamOptions = {
  width: 240,
  height: 180,
  facingMode: "user"
};

function Cam ({peer}) {
  const ref = useRef();
  // const webcamRef = useRef();
  const capture = useCallback(
    () => {
      const imageSrc = ref.current.getScreenshot();
      socket.emit("snap-image", imageSrc);
    },
    [ref]
  );
  
  useEffect(() => {
      peer.on("stream", stream => {
        if ('srcObject' in ref.current) {
          ref.current.srcObject = stream;
        }
      })
  }, [peer]);

  return (
      <div>
        <Webcam ref={ref} audio={true} videoConstraints={webcamOptions} screenshotFormat="image/jpeg" />
        <Button colorScheme="teal" size="sm" onClick={capture}>Capture photo</Button>
      </div>
  );
}

function Video({u, room}) {
    const [peers, setPeers] = useState([]);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
      socket.on("image", ({imageSrc}) => {
        setImages([...images, {imageSrc}]);
      })
    })
  
    useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: webcamOptions, audio: true }).then(stream => {
        socket.emit('init', room);  
        userVideo.current.srcObject = stream;
          socket.on('all users', users => {
            const peers = [];
            users.forEach(userID => {
            const peer = createPeer(userID, socket.id, stream);
            peersRef.current.push({
                peerID: userID,
                peer,
            })
            peers.push(peer);
            })
            setPeers(peers);
          })

          socket.on("user joined", payload => {
              const peer = addPeer(payload.signal, payload.callerID, stream);
              peersRef.current.push({
                  peerID: payload.callerID,
                  peer,
              })

              setPeers(users => [...users, peer]);
          });

          socket.on("receiving returned signal", payload => {
              const item = peersRef.current.find(p => p.peerID === payload.id);
              item.peer.signal(payload.signal);
          });
      })
  }, [room]);

  function createPeer(userToSignal, callerID, stream) {
      const peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
          config: {
            iceServers: [
              {
                urls: 'stun:stun.webcalldirect.com:3478'
              },
              {
                urls: 'stun:stun.siptraffic.com:3478'
              },
              {
                urls: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
              },
              {
                urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
              }
            ]
          },
      });

      peer.on("signal", signal => {
          socket.emit("sending signal", { userToSignal, callerID, signal })
      })

      return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
          config: {
            iceServers: [
              {
                urls: 'stun:stun.webcalldirect.com:3478'
              },
              {
                urls: 'stun:stun.siptraffic.com:3478'
              },
              {
                urls: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808'
              },
              {
                urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
              }
            ]
          },
      })

      peer.on("signal", signal => {
          socket.emit("returning signal", { signal, callerID })
      })

      peer.signal(incomingSignal);

      return peer;
  }

    // const webcamRef = useRef(null);
    const capture = useCallback(
      () => {
        const imageSrc = userVideo.current.getScreenshot();
        socket.emit("snap-image", imageSrc);
      },
      [userVideo]
    );

    return (
    <div>
      <Webcam ref={userVideo} muted videoConstraints={webcamOptions} screenshotFormat="image/jpeg" />
      <Button colorScheme="teal" size="sm" onClick={capture}>Capture photo</Button>
      <hr />
      <Gallery images={images} />
    </div>
  );
}

export default Video
