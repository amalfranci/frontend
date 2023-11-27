// VideoModal.js
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Center } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { color } from 'framer-motion';

const VideoModal = ({ isOpen, onClose, onSubmit ,users,roomid }) => {
    const { user } = useSelector((state) => state.user);
    console.log("this is importent children",roomid)

  const [email, setEmail] = useState(user.email || '');
  const [room, setRoom] = useState(roomid || '');

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
   socket.emit("setup", {email,room});
    onSubmit({ email, room });
   

    },
    
   
    [email, room, onSubmit]
    
  );
    const { socket } =
    ChatState();
  console.log("sokect", socket)

  const navigate=useNavigate()

  const handleJoinRoom = useCallback((userData) => {
    
    const { email, room } = userData
   navigate(`/room/${room}`)
  },[])
 
  
  useEffect(() => {
    socket.on('setup', handleJoinRoom)
    return () => {
      socket.off("setup",handleJoinRoom)
    }
  },[socket,handleJoinRoom])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a video call</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmitForm}>
            <label htmlFor='email'></label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
            <br />
            <label htmlFor='room'>Chat with</label>
            <input
              type='text'
              id='room'
              value={room}
              onChange={(e) => setRoom(e.target.value)}
           
            />
            <br />
            <button type='submit' style={{color:"blue"}}>Join</button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VideoModal;
