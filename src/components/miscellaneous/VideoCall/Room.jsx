import React,{useCallback, useEffect, useState} from 'react'
import { ChatState } from '../../Context/ChatProvider';
import peer from './Service/peer';
import { Button, Heading, Box, Flex, Container,Card } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';


import ReactPlayer from 'react-player'

function Room() {

    const { socket } = ChatState();

    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState(null)
    const [callEnded, setCallEnded] = useState(false);
  
    
  const [remoteStream, setRemoteStream] = useState()
  
  const [acceptButtonPressed, setAcceptButtonPressed] = useState(false);
  

    const navigate=useNavigate()
    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room `)
        setRemoteSocketId(id)
        
    }, [])
    
    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video:true
        })
        const offer = await peer.getOffer()
        socket.emit("user:call",{to:remoteSocketId,offer})
        setMyStream(stream)
        
    }, [remoteSocketId, socket])
    
    const handleIncommingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from)
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video:true
          })
          setMyStream(stream)
        console.log(`incoming call`, from, offer)
        const ans = await peer.getAnswer(offer)
        socket.emit('call:accepted',{to:from,ans})
        
    }, [socket])
    
      const sendStreams = useCallback(() => {
          for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track,myStream)
        }setAcceptButtonPressed(true)
    },[myStream])
    
  const handleCallAccepted = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans);
    console.log("call Accepted");
    sendStreams();
    setAcceptButtonPressed(true)
  }, [sendStreams]);

   const leaveCall = () => {
    setCallEnded(true);
    // Close the stream and connections
    if (myStream) {
      myStream.getTracks().forEach((track) => {
        track.stop();
      });
       }
       navigate('/chats')
   
  };
  

    const handleNegoNeeded = useCallback(async () => {
          const offer = await peer.getOffer()
            socket.emit('peer:nego:needed',{offer,to:remoteSocketId})
        
    }, [remoteSocketId, socket])
    
    const handleNegoNeedIncomming = useCallback(async({ from, offer }) => {
        const ans = await peer.getAnswer(offer)
        socket.emit('peer:nego:done',{to:from,ans})
        
    }, [socket])
    
    const handleNegoNeddFinal = useCallback(async({ ans }) => {
       await  peer.setLocalDescription(ans)
        
    },[])

    useEffect(() => {
        
        peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
        return () => {
              peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
        }
    },[handleNegoNeeded])
    
    useEffect(() => {
        peer.peer.addEventListener('track', async ev => {
            const remoteStream = ev.streams
            setRemoteStream(remoteStream[0])
        })
        
    },[])

    useEffect(() => {
        socket.on("user:joined", handleUserJoined)
        socket.on('incomming:call', handleIncommingCall)
        socket.on("call:accepted", handleCallAccepted)
        socket.on("peer:nego:needed", handleNegoNeedIncomming)
        socket.on("peer:nego:final",handleNegoNeddFinal)
        return () => {
            socket.off("user:joined", handleUserJoined)
            socket.off('incomming:call', handleIncommingCall)
            socket.off("call:accepted", handleCallAccepted)
             socket.off("peer:nego:needed", handleNegoNeedIncomming)
        socket.off("peer:nego:final",handleNegoNeddFinal)
            
        }
        
    },[socket,handleUserJoined,handleIncommingCall,handleCallAccepted,handleIncommingCall])

  return (
 <Box bg="lightblue" minH="100vh" p={4}>
      <Container maxW="container.md">
        <Card p={6} borderRadius="md" bg="grey">
          <Flex justify="space-between" align="center" mb={5}>
            <Box flex="1" textAlign="center" mr={2}>
              <Heading as="h5" size="xl" mb={3}>
                VIDEO CHAT
              </Heading>
              <Heading as="h6" size="lg" mb={3} color={remoteSocketId ? 'green' : 'red'}>
                {remoteSocketId ? 'User Online' : 'Friend not available '}
              </Heading>
              {remoteSocketId && 'User Online' && !remoteStream && (
                <Button colorScheme="blue" size="lg" mb={3} onClick={handleCallUser}>
                  CALL
                </Button>
              )}
              {myStream && remoteStream && (
                <Button colorScheme="red" size="lg" onClick={leaveCall} ml={3}>
                  Stop
                </Button>
              )}
            </Box>
            {myStream && (
              <Box flex="1">
                
                <ReactPlayer height="200px" width="300px" playing muted url={myStream} />
              </Box>
            )}
          </Flex>
          {remoteStream && (
            <Flex justify="space-between" align="center">
              <Box flex="1" mr={2}>
                <Heading as="h1" size="lg" mb={3}>
                Remote user
                </Heading>
                {myStream && (
                  <Box mb={3}>

                    {!acceptButtonPressed &&
                      <>
                    

                    <Button
                    colorScheme="green"
                    size="lg"
                    onClick={sendStreams}
                    disabled ={acceptButtonPressed}
                      >
                       
                      Accept
                    </Button>
                      </>
                    }
                  </Box>
                )}
                <ReactPlayer height="200px" width="300px" playing muted url={remoteStream} />
              </Box>
            </Flex>
          )}
        </Card>
      </Container>
    </Box>
  );
}
export default Room
