import { ViewIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  useDisclosure,
  useToast,
  Spinner
} from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRemoveUser = async (userToRemove) => {
    if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
      toast({
        title: "Only Admins can remove user from group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      const { data } = axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id
        },
        config
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      fetchMessages();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      setLoading(false);
    }
  };

  const handleRenameGroup = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.put('/api/chat/rename',
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);

      toast({
        title: "Group renamed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find(u => u._id === userToAdd._id)) {
      toast({
        title: "User Already Added",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins can add user to group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      };

      const { data } = axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
      setLoading(false);
    }

  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        icon={<ViewIcon />}
        display={{ base: "flex" }}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map(user => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleClick={() => handleRemoveUser(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRenameGroup}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? <Spinner size="lg" /> : (
              searchResult?.slice(0, 4).map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleClick={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemoveUser(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal;