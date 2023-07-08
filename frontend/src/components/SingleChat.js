import React, { useEffect, useState } from 'react';
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import io from "socket.io-client";
import Lottie from "react-lottie";
import axios from 'axios';

import { ChatState } from '../Context/ChatProvider';
import { getSenderName, getSenderDetails } from '../config/ChatLogics';
import ProfileModel from './miscellaneous/ProfileModel';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import animationData from '../animations/typing.json';

const END_POINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    },
  };


  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

      setMessages(data);
      setLoading(false);

      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config,
        );
        console.log('>>>', data);

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right"
        });
      }
    }
  };

  const typingHandler = (event) => {
    setNewMessage(event.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDifference = timeNow - lastTypingTime;
      if (timeDifference >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(END_POINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare
        || selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });

  }); // no dependency as need to call it every time

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModel
                  user={getSenderDetails(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            justifyContent="flex-end"
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflow="hidden"
          >
            {loading ? (
              <Spinner
                size="lg"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
            >
              {isTyping ? (<div>
                <Lottie
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                  options={defaultOptions}
                />
              </div>
              ) : <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;