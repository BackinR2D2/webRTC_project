import React, {useRef, useCallback, useState, useEffect} from 'react'
import Webcam from "react-webcam";
import socket from '../config';
import Gallery from './Gallery';
import { Button } from "@chakra-ui/react"

const webcamOptions = {
  width: window.screen.width < window.screen.height ? 240 : 320,
  height: window.screen.width < window.screen.height ? 320 : 240,
  facingMode: "user"
};

function Video({room}) {
  const userVideo = useRef();
  const [images, setImages] = useState([]);

    useEffect(() => {
      socket.on("image", (imageSrc) => {
        setImages([...images, imageSrc]);
      })
    })
  
    const capture = useCallback(
      () => {
        const imageSrc = userVideo.current.getScreenshot();
        socket.emit("snap-image", {imageSrc, room});
      },
      [userVideo, room]
    );

    return (
    <div className="vComp">
      <Webcam ref={userVideo} videoConstraints={webcamOptions} screenshotFormat="image/jpeg" />
      <div className="btnSection">
        <Button className="photoBtn" style={{margin: `${14}px`}} colorScheme="teal" onClick={capture}>Capture photo</Button>
        <Gallery images={images} />
      </div>
    </div>
  );
}

export default Video
