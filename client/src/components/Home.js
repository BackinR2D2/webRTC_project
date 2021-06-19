import React, { useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [id, setId] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleRoomGenerate = async () => {
    const {data: id} = await axios(`http://localhost:5000/homepage`);
    setId(id);
    setGenerated(true);
  }
  
  return (
    <div>
      <h3>Generate a room and invite your friends</h3>
      {
        generated ? 
        <p>Room id: <Link to={{pathname: `/room/${id}`}}>{id}</Link></p>
        :
        <button onClick={handleRoomGenerate}>Generate</button>
      }
      <hr />
    </div>
  );
}

export default Home
